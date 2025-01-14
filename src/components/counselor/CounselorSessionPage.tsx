import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format, isWithinInterval, parseISO, subMinutes, addMinutes } from 'date-fns';
import { Loader2 } from 'lucide-react';
import Script from 'next/script';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useGetCounselorActiveSessionQuery } from '@/redux/feautures/booking/bookingApi';

const CounselorSessionPage = () => {
  const router = useRouter();
  const { data: activeSession, isLoading } = useGetCounselorActiveSessionQuery();
  const [error, setError] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [isDailyLoaded, setIsDailyLoaded] = useState(false);
  const [callFrame, setCallFrame] = useState(null);

  const handleDailyLoad = () => {
    setIsDailyLoaded(true);
  };

// Replace your existing parseMeetingDateTime function with this:
const parseMeetingDateTime = (meeting: any) => {
  try {
    if (!meeting?.meetingDate || !meeting?.meetingTime) return null;

    // First handle the date part
    let dateValue: Date;
    if (typeof meeting.meetingDate === 'string') {
      // If it's an ISO string with time (contains 'T')
      if (meeting.meetingDate.includes('T')) {
        dateValue = parseISO(meeting.meetingDate);
      } else {
        // If it's just a date string
        dateValue = new Date(meeting.meetingDate);
      }
    } else {
      dateValue = new Date(meeting.meetingDate);
    }

    if (isNaN(dateValue.getTime())) {
      console.error('Invalid date value');
      return null;
    }

    // Format the date part and combine with time
    const dateStr = format(dateValue, 'yyyy-MM-dd');
    const dateTimeStr = `${dateStr}T${meeting.meetingTime}`;

    // Create a new date object that will respect the local timezone
    const localDate = new Date(dateTimeStr);

    // Log times for debugging
    console.log('Original meeting date:', meeting.meetingDate);
    console.log('Original meeting time:', meeting.meetingTime);
    console.log('Parsed local date:', localDate);
    console.log('Local date ISO string:', localDate.toISOString());
    console.log('Local timezone offset:', localDate.getTimezoneOffset());

    return localDate;
  } catch (err) {
    console.error('Error parsing meeting datetime:', err);
    return null;
  }
};

  const isWithinSessionWindow = (meetingDateTime: Date) => {
    if (!meetingDateTime) return false;
    
    const now = new Date();
    const sessionStart = subMinutes(meetingDateTime, 5);
    const sessionEnd = addMinutes(meetingDateTime, 45);
  
    // Log times for debugging
    console.log('Current time:', now);
    console.log('Session start:', sessionStart);
    console.log('Meeting time:', meetingDateTime);
    console.log('Session end:', sessionEnd);
  
    return isWithinInterval(now, {
      start: sessionStart,
      end: sessionEnd
    });
  };
  useEffect(() => {
    let meetingEndedTimeout:any;

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

  const getMeetingAccess = async () => {
    if (!activeSession?.booking?._id) {
      setError('No active session found');
      return;
    }

    if (!isDailyLoaded) {
      setError('Video conferencing SDK not loaded. Please refresh the page.');
      return;
    }

    setIsJoining(true);
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/meeting-token/${activeSession.booking._id}`, {
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

      frame
        .on('left-meeting', handleEndCall)
        .on('error', (e) => {
          console.error('Daily.co error:', e);
          setError('Failed to connect to meeting room. Please try refreshing.');
        });

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

  const handleEndCall = async () => {
    try {
      if (callFrame) {
        await callFrame.leave();
        setCallFrame(null);
      }
      
      if (activeSession?.booking?._id) {
        await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/complete/${activeSession.booking._id}`, {
          method: 'POST',
          credentials: 'include'
        });
      }
      await router.push('/counselor/history');

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

  if (!activeSession?.booking || activeSession.booking.status !== 'confirmed') {
    return (
      <Card className="max-w-2xl mx-auto mt-8">
        <CardHeader>
          <CardTitle>No Active Session</CardTitle>
          <CardDescription>
            You don't have any confirmed sessions at the moment.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => router.push('/counselor/requests')}>
            View Session Requests
          </Button>
        </CardContent>
      </Card>
    );
  }

  const meeting = activeSession.booking;
  const meetingDateTime = parseMeetingDateTime(meeting);
  const canJoinMeeting = meetingDateTime ? isWithinSessionWindow(meetingDateTime) : false;

  const getSessionStatus = () => {
    if (!meetingDateTime) {
      return 'Error loading session time';
    }
    
    const now = new Date();
    const sessionStart = subMinutes(meetingDateTime, 5);
    
    if (now < sessionStart) {
      return 'Please wait until 5 minutes before the session';
    }
    
    if (now > addMinutes(meetingDateTime, 45)) {
      return 'Session has ended';
    }
    
    return 'Session is active';
  };

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
                <h3 className="font-medium mb-2">Counselor Guidelines</h3>
                <ul className="space-y-2 text-sm">
                  <li>• This is an anonymous voice session - video is disabled</li>
                  <li>• Maintain strict client confidentiality</li>
                  <li>• Session duration is 45 minutes</li>
                  <li>• Use the chat feature for sharing resources if needed</li>
                  <li>• Ensure you're in a quiet, professional environment</li>
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

export default CounselorSessionPage;