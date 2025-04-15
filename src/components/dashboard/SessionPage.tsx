import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format, isWithinInterval, parseISO, subMinutes, addMinutes } from 'date-fns';
import { Loader2, AlertCircle, InfoIcon } from 'lucide-react';
import Script from 'next/script';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useGetActiveBookingQuery } from '@/redux/feautures/booking/bookingApi';
import { useSocket } from '../SocketProvider';

interface DailyCallFrame {
  join: (options: { url: string; token: string }) => Promise<void>;
  leave: () => Promise<void>;
  destroy: () => Promise<void>;
  on: (event: string, callback: (...args: any[]) => void) => DailyCallFrame;
}

const SessionPage = () => {
  const router = useRouter();
  const socket = useSocket();
  const { data: activeBooking, isLoading, refetch } = useGetActiveBookingQuery();
  const [error, setError] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [isDailyLoaded, setIsDailyLoaded] = useState(false);
  const [callFrame, setCallFrame] = useState<DailyCallFrame | null>(null);
  const [timeUntilSession, setTimeUntilSession] = useState<string | null>(null);

  // Socket event handling for real-time updates
  useEffect(() => {
    if (!socket) return;

    const handleBookingUpdate = () => {
      refetch();
    };

    socket.on('booking_updated', handleBookingUpdate);

    return () => {
      socket.off('booking_updated', handleBookingUpdate);
    };
  }, [socket, refetch]);

  // Parse meeting datetime and calculate time until session
  useEffect(() => {
    if (!activeBooking?.booking) return;

    const meeting = activeBooking.booking;
    const meetingDateTime = parseMeetingDateTime(meeting);
    
    if (!meetingDateTime) return;

    const updateTimeUntilSession = () => {
      const now = new Date();
      const sessionStart = subMinutes(meetingDateTime, 5); // 5 min before
      
      if (now < sessionStart) {
        const diffMs = sessionStart.getTime() - now.getTime();
        const diffMins = Math.ceil(diffMs / (1000 * 60));
        
        if (diffMins <= 60) {
          setTimeUntilSession(`Available in ${diffMins} minute${diffMins !== 1 ? 's' : ''}`);
        } else {
          const hours = Math.floor(diffMins / 60);
          const mins = diffMins % 60;
          setTimeUntilSession(`Available in ${hours} hour${hours !== 1 ? 's' : ''} ${mins > 0 ? `and ${mins} minute${mins !== 1 ? 's' : ''}` : ''}`);
        }
      } else {
        setTimeUntilSession(null);
      }
    };

    updateTimeUntilSession();
    const timer = setInterval(updateTimeUntilSession, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, [activeBooking]);

  // Call frame event listeners
  useEffect(() => {
    let meetingEndedTimeout: NodeJS.Timeout;

    if (callFrame) {
      callFrame
        .on('left-meeting', handleEndCall)
        .on('error', (e) => {
          console.error('Daily.co error:', e);
          setError('Failed to connect to meeting room. Please try refreshing.');
        })
        .on('meeting-ended', () => {
          meetingEndedTimeout = setTimeout(handleEndCall, 2000);
        });
    }

    return () => {
      if (meetingEndedTimeout) {
        clearTimeout(meetingEndedTimeout);
      }
      if (callFrame) {
        try {
          callFrame.leave();
        } catch (err) {
          console.error('Error leaving call:', err);
        }
      }
    };
  }, [callFrame]);

  // Timer for session end warning and auto-ending call
  useEffect(() => {
    if (!callFrame || !activeBooking?.booking?.meetingDate || !activeBooking?.booking?.meetingTime) return;

    const meetingDateTime = parseMeetingDateTime(activeBooking.booking);
    if (!meetingDateTime) return;

    const sessionEndTime = addMinutes(meetingDateTime, 45);
    const now = new Date().getTime();
    const timeUntilEnd = sessionEndTime.getTime() - now;
    const timeUntilWarning = timeUntilEnd - (5 * 60 * 1000); // 5 minutes before end

    if (timeUntilEnd <= 0) {
      handleEndCall();
      return;
    }

    // Set warning timer
    const warningTimer = setTimeout(() => {
      toast.warning('Session will end in 5 minutes', {
        duration: 10000, // Show for 10 seconds
        position: 'top-center',
      });
    }, Math.max(0, timeUntilWarning));

    // Set end call timer
    const endCallTimer = setTimeout(() => {
      handleEndCall();
    }, timeUntilEnd);

    return () => {
      clearTimeout(warningTimer);
      clearTimeout(endCallTimer);
    };
  }, [callFrame, activeBooking?.booking]);

  const handleDailyLoad = () => {
    setIsDailyLoaded(true);
  };

  const parseMeetingDateTime = (meeting: any): Date | null => {
    try {
      if (!meeting?.meetingDate || !meeting?.meetingTime) {
        return null;
      }
  
      let meetingDate: Date;
      const meetingTime = meeting.meetingTime;
  
      // Handle different date formats
      if (typeof meeting.meetingDate === 'string') {
        // If it's already an ISO string with time component
        if (meeting.meetingDate.includes('T')) {
          const dateOnly = meeting.meetingDate.split('T')[0];
          return new Date(`${dateOnly}T${meetingTime}`);
        } 
        // Otherwise assume it's a date string without time
        meetingDate = new Date(meeting.meetingDate);
      } else if (meeting.meetingDate instanceof Date) {
        meetingDate = meeting.meetingDate;
      } else {
        console.error('Unrecognized meeting date format:', meeting.meetingDate);
        return null;
      }
  
      // Check if the parsed date is valid
      if (isNaN(meetingDate.getTime())) {
        console.error('Invalid meeting date');
        return null;
      }
  
      // Format date to YYYY-MM-DD
      const year = meetingDate.getFullYear();
      const month = String(meetingDate.getMonth() + 1).padStart(2, '0');
      const day = String(meetingDate.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
  
      // Create new date with time
      const dateTimeStr = `${dateStr}T${meetingTime}`;
      const result = new Date(dateTimeStr);
  
      // Final validation
      if (isNaN(result.getTime())) {
        console.error('Invalid meeting date/time combination');
        return null;
      }
  
      return result;
    } catch (err) {
      console.error('Error parsing meeting datetime:', err);
      return null;
    }
  };
  
  const isWithinSessionWindow = (meetingDateTime: Date | null): boolean => {
    if (!meetingDateTime || isNaN(meetingDateTime.getTime())) {
      console.error('Invalid meeting date/time provided to isWithinSessionWindow');
      return false;
    }
  
    const now = new Date();
    
    // Session can be joined 5 minutes before scheduled time
    const sessionStart = new Date(meetingDateTime.getTime() - (5 * 60 * 1000));
    
    // Session ends 45 minutes after scheduled time
    const sessionEnd = new Date(meetingDateTime.getTime() + (45 * 60 * 1000));
  
    // Log for debugging
    console.log('Session window check:', {
      now: now.toISOString(),
      sessionStart: sessionStart.toISOString(),
      sessionEnd: sessionEnd.toISOString(),
      canJoin: now >= sessionStart && now <= sessionEnd
    });
  
    return now >= sessionStart && now <= sessionEnd;
  };
  
  const getSessionStatus = (meetingDateTime: Date | null, meetingStatus: string): string => {
    if (!meetingDateTime) {
      return 'Error loading session time';
    }
    
    if (meetingStatus === 'abandoned') {
      return 'Session was abandoned due to no attendance';
    }
    
    const now = new Date();
    const sessionStart = new Date(meetingDateTime.getTime() - (5 * 60 * 1000)); // 5 min before
    const sessionEnd = new Date(meetingDateTime.getTime() + (45 * 60 * 1000)); // 45 min after
    
    if (now < sessionStart) {
      const minutesUntilStart = Math.ceil((sessionStart.getTime() - now.getTime()) / (60 * 1000));
      return `Session will be available in ${minutesUntilStart} minute${minutesUntilStart !== 1 ? 's' : ''}`;
    }
    
    if (now > sessionEnd) {
      return 'Session has ended';
    }
    
    return 'Session is active - Join now';
  };

  const getMeetingAccess = async () => {
    if (!activeBooking?.booking?._id) {
      setError('No active booking found');
      return;
    }

    if (!isDailyLoaded) {
      setError('Video conferencing SDK not loaded. Please refresh the page.');
      return;
    }

    setIsJoining(true);
    setError('');

    try {
      // Get access token from localStorage
      const accessToken = localStorage.getItem('access_token');
      
      if (!accessToken) {
        throw new Error('Authentication token not found. Please log in again.');
      }

      console.log(`Requesting meeting token for meeting: ${activeBooking.booking._id}`);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/meeting-token/${activeBooking.booking._id}`, 
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get meeting access');
      }
      
      const data = await response.json();
      console.log('Meeting token received', { token: 'redacted', roomUrl: data.roomUrl });

      const frame = await window.DailyIframe.createFrame({
        iframeStyle: {
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          border: '0',
          zIndex: 999
        },
        showLeaveButton: true,
        showFullscreenButton: true,
      });

      console.log('Daily.co frame created');
      setCallFrame(frame);

      await frame.join({ 
        url: data.roomUrl, 
        token: data.token
      });
      console.log('Joined meeting successfully');

    } catch (err) {
      console.error('Meeting access error:', err);
      setError(err instanceof Error ? err.message : 'Failed to join meeting. Please try again.');
    } finally {
      setIsJoining(false);
    }
  };

  const handleEndCall = async () => {
    try {
      if (callFrame) {
        console.log('Leaving call...');
        await callFrame.leave();
        setCallFrame(null);
      }
      
      if (activeBooking?.booking?._id) {
        console.log('Completing session...');
        const accessToken = localStorage.getItem('access_token');
        
        if (!accessToken) {
          throw new Error('Authentication token not found');
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/complete/${activeBooking.booking._id}`, 
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              sessionDetails: {
                duration: 45, // Default to full session
                status: 'completed'
              }
            })
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error completing session:', errorData);
        } else {
          console.log('Session completed successfully');
        }
      }
      
      await router.push('/dashboard/history');

      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (err) {
      console.error('Error ending call:', err);
      setError('Failed to end call properly. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!activeBooking?.booking || !['confirmed', 'time_selected'].includes(activeBooking.booking.status)) {
    return (
      <Card className="max-w-2xl mx-auto mt-8">
        <CardHeader>
          <CardTitle>No Active Session</CardTitle>
          <CardDescription>
            {activeBooking?.booking?.status === 'abandoned' 
              ? 'This session was marked as abandoned because neither party joined within 15 minutes of the start time.'
              : "You don't have any confirmed sessions at the moment."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => router.push('/dashboard/book')}>
            Book a Session
          </Button>
        </CardContent>
      </Card>
    );
  }

  const meeting = activeBooking.booking;
  const meetingDateTime = parseMeetingDateTime(meeting);
  const canJoinMeeting = meetingDateTime ? isWithinSessionWindow(meetingDateTime) : false;
  const sessionStatus = meetingDateTime ? getSessionStatus(meetingDateTime, meeting.status) : 'Error loading session time';

  return (
    <>
      <Script
        src="https://unpkg.com/@daily-co/daily-js"
        onLoad={handleDailyLoad}
        onError={() => setError('Failed to load video conferencing SDK. Please refresh the page.')}
      />
      {!callFrame ? (
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Counseling Session</CardTitle>
            <CardDescription>
              {meetingDateTime 
                ? `${format(meetingDateTime, 'EEEE, MMMM d, yyyy')} at ${format(meetingDateTime, 'h:mm a')}`
                : 'Error loading session time - Please contact support'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {!canJoinMeeting && timeUntilSession && (
              <Alert>
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>Upcoming Session</AlertTitle>
                <AlertDescription>
                  {timeUntilSession}. You'll be able to join 5 minutes before the scheduled time.
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Session Guidelines</h3>
                <ul className="space-y-2 text-sm">
                  <li>• This is an anonymous voice session - video is disabled</li>
                  <li>• Session duration is 45 minutes</li>
                  <li>• You can use the chat feature if needed</li>
                  <li>• Ensure you're in a quiet, private space</li>
                  <li>• Join 5 minutes before the scheduled time</li>
                </ul>
              </div>

              <Button
                onClick={getMeetingAccess}
                disabled={!canJoinMeeting || isJoining || !isDailyLoaded}
                className="w-full"
              >
                {isJoining ? (
                  <span className="flex items-center">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Joining Session...
                  </span>
                ) : (
                  !isDailyLoaded ? 'Loading...' : (canJoinMeeting ? 'Join Session' : sessionStatus)
                )}
              </Button>
            </div>
          </CardContent>
          <CardFooter className="text-sm text-gray-500 dark:text-gray-400 flex justify-center">
            <p>Need help? Contact support at support@micounselor.com</p>
          </CardFooter>
        </Card>
      ) : null}
    </>
  );
};

export default SessionPage;