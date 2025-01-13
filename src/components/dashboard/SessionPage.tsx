import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format, isWithinInterval, parseISO, subMinutes, addMinutes } from 'date-fns';
import { Loader2 } from 'lucide-react';
import Script from 'next/script';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useGetActiveBookingQuery } from '@/redux/feautures/booking/bookingApi';
import { useSocket } from '@/components/SocketProvider';

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
        callFrame.leave();
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
    }, timeUntilWarning);

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
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/meeting-token/${activeBooking.booking._id}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get meeting access');
      }
      
      const data = await response.json();

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

      setCallFrame(frame);

      await frame.join({ 
        url: data.roomUrl, 
        token: data.token
      });

    } catch (err) {
      console.error('Meeting access error:', err);
      setError(err instanceof Error ? err.message : 'Failed to join meeting. Please try again.');
    } finally {
      setIsJoining(false);
    }
  };

  const parseMeetingDateTime = (meeting: any) => {
    try {
      if (!meeting?.meetingDate || !meeting?.meetingTime) return null;

      const dateValue = typeof meeting.meetingDate === 'string' 
        ? meeting.meetingDate.includes('T') 
          ? parseISO(meeting.meetingDate)  
          : new Date(meeting.meetingDate)  
        : new Date(meeting.meetingDate);   

      if (isNaN(dateValue.getTime())) return null;

      const dateStr = format(dateValue, 'yyyy-MM-dd');
      const dateTimeStr = `${dateStr}T${meeting.meetingTime}`;
      return new Date(dateTimeStr);
    } catch (err) {
      console.error('Error parsing meeting datetime:', err);
      return null;
    }
  };

  const isWithinSessionWindow = (meetingDateTime: Date) => {
    const now = new Date();
    const sessionStart = subMinutes(meetingDateTime, 5);
    const sessionEnd = addMinutes(meetingDateTime, 45);

    return isWithinInterval(now, {
      start: sessionStart,
      end: sessionEnd
    });
  };

  const getSessionStatus = () => {
    if (!meetingDateTime) {
      return 'Error loading session time';
    }
    
    const now = new Date();
    const sessionStart = subMinutes(meetingDateTime, 5);
    
    if (now < sessionStart) {
      return 'Please wait 5 minutes before';
    }
    
    if (now > addMinutes(meetingDateTime, 45)) {
      return 'Session has ended';
    }
    
    return 'Session is active';
  };

  const handleEndCall = async () => {
    try {
      if (callFrame) {
        await callFrame.leave();
        setCallFrame(null);
      }
      
      if (activeBooking?.booking?._id) {
        await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/complete/${activeBooking.booking._id}`, {
          method: 'POST',
          credentials: 'include'
        });
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
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!activeBooking?.booking || activeBooking.booking.status !== 'confirmed') {
    return (
      <Card className="max-w-2xl mx-auto mt-8">
        <CardHeader>
          <CardTitle>No Active Session</CardTitle>
          <CardDescription>
            You don't have any confirmed sessions at the moment.
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

  return (
    <>
      <Script
        src="https://unpkg.com/@daily-co/daily-js"
        onLoad={handleDailyLoad}
      />
      {!callFrame ? (
        <Card className="max-w-4xl mx-auto mt-8">
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
                <AlertDescription>{error}</AlertDescription>
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
                  !isDailyLoaded ? 'Loading...' : (canJoinMeeting ? 'Join Session' : getSessionStatus())
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </>
  );
};

export default SessionPage;