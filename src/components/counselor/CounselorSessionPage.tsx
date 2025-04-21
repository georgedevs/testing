import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { format, parseISO, subMinutes, addMinutes } from 'date-fns';
import { Loader2, AlertCircle, InfoIcon, Clock, RefreshCcw } from 'lucide-react';
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
import { Progress } from "@/components/ui/progress";
import { useGetCounselorActiveSessionQuery } from '@/redux/feautures/booking/bookingApi';
import { useSocket } from '../SocketProvider';
import { useAutoAbandon } from '../useAutoAbandon';

interface DailyCallFrame {
  join: (options: { url: string; token: string }) => Promise<void>;
  leave: () => Promise<void>;
  destroy: () => Promise<void>;
  on: (event: string, callback: (...args: any[]) => void) => DailyCallFrame;
}

interface ParticipantStatus {
  joined: boolean;
  lastActive?: Date;
}

interface MeetingStatusData {
  clientJoined: boolean;
  counselorJoined: boolean;
  graceActive: boolean;
  gracePeriodRemaining?: number;
  status: string;
}

const CounselorSessionPage = () => {
  const router = useRouter();
  const socket = useSocket();
  const { data: activeSession, isLoading, refetch } = useGetCounselorActiveSessionQuery();
  const [error, setError] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [isDailyLoaded, setIsDailyLoaded] = useState(false);
  const [callFrame, setCallFrame] = useState<DailyCallFrame | null>(null);
  const [timeUntilSession, setTimeUntilSession] = useState<string | null>(null);
  const [hasJoinedSuccessfully, setHasJoinedSuccessfully] = useState(false);
  const [isFullyJoined, setIsFullyJoined] = useState(false);
  const [showLeaveConfirmation, setShowLeaveConfirmation] = useState(false);
  const [clientStatus, setClientStatus] = useState<ParticipantStatus>({ joined: false });
  const [gracePeriodActive, setGracePeriodActive] = useState(false);
  const [gracePeriodRemaining, setGracePeriodRemaining] = useState(0);
  const [reconnectPrompt, setReconnectPrompt] = useState(false);
  const [meetingStatus, setMeetingStatus] = useState<MeetingStatusData | null>(null);
  const meetingIdRef = useRef<string | null>(null);
  const statusPollingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const graceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const leaveInProgressRef = useRef(false);

  // Set up auto-abandonment tracking for cases when neither party joins
  useAutoAbandon(activeSession?.booking);

  // Error handling for Daily.co media errors
  const handleDailyPlayError = (e: any) => {
    if (e && e.message && e.message.includes('play() request was interrupted')) {
      console.log('Ignoring known Daily.co media play error');
      return true;
    }
    return false;
  };

  // Set up global error handler for media errors
  useEffect(() => {
    const handleError = (e: ErrorEvent) => {
      if (handleDailyPlayError(e.error || e)) {
        e.preventDefault();
        return;
      }
    };

    window.addEventListener('error', handleError, true);
    
    return () => {
      window.removeEventListener('error', handleError, true);
    };
  }, []);

  // Store meeting ID in ref for use in cleanup functions
  useEffect(() => {
    if (activeSession?.booking?._id) {
      meetingIdRef.current = activeSession.booking._id;
    }
  }, [activeSession]);

  // Socket event handling for real-time updates
  useEffect(() => {
    if (!socket || !activeSession?.booking?._id) return;

    const handleBookingUpdate = () => {
      console.log('Booking update received, refetching...');
      refetch();
    };

    const handleParticipantStatus = (data: any) => {
      console.log('Participant status update:', data);
      if (data.role === 'client') {
        setClientStatus({
          joined: data.status === 'joined',
          lastActive: data.timestamp ? new Date(data.timestamp) : undefined
        });

        if (data.status === 'joined' && !clientStatus.joined) {
          toast.success('Client has joined the session', {
            duration: 5000,
            position: 'top-center'
          });
        } else if (data.status === 'left' && clientStatus.joined) {
          toast.info('Client has left the session', {
            duration: 5000,
            position: 'top-center'
          });
        }
      }
    };

    const handleGracePeriod = (data: any) => {
      console.log('Grace period update:', data);
      if (data.meetingId === activeSession.booking._id) {
        setGracePeriodActive(true);
        const endTime = new Date(data.graceEndTime).getTime();
        const now = new Date().getTime();
        const remainingSeconds = Math.max(0, Math.floor((endTime - now) / 1000));
        setGracePeriodRemaining(remainingSeconds);
        
        if (data.participant === 'client') {
          setReconnectPrompt(true);
          toast.info(`Client left. You can wait ${Math.floor(remainingSeconds / 60)} minutes for them to reconnect.`, {
            duration: 10000,
            position: 'top-center'
          });
        }
      }
    };

    const handleSessionCompleted = (data: any) => {
      console.log('Session completed update:', data);
      if (data.meetingId === activeSession.booking._id) {
        toast.success('The session has been completed', {
          duration: 5000,
          position: 'top-center'
        });
        
        // Reset UI state
        setShowLeaveConfirmation(false);
        setGracePeriodActive(false);
        setReconnectPrompt(false);
        
        // Navigate to history page
        setTimeout(() => {
          router.push('/counselor/history');
        }, 3000);
      }
    };

    socket.on('booking_updated', handleBookingUpdate);
    socket.on('participant_status', handleParticipantStatus);
    socket.on('grace_period', handleGracePeriod);
    socket.on('session_completed', handleSessionCompleted);

    return () => {
      socket.off('booking_updated', handleBookingUpdate);
      socket.off('participant_status', handleParticipantStatus);
      socket.off('grace_period', handleGracePeriod);
      socket.off('session_completed', handleSessionCompleted);
    };
  }, [socket, activeSession, refetch, clientStatus.joined, router]);

  // Grace period countdown timer
  useEffect(() => {
    if (gracePeriodActive && gracePeriodRemaining > 0) {
      if (graceTimerRef.current) {
        clearInterval(graceTimerRef.current);
      }
      
      graceTimerRef.current = setInterval(() => {
        setGracePeriodRemaining(prev => {
          if (prev <= 1) {
            if (graceTimerRef.current) clearInterval(graceTimerRef.current);
            setGracePeriodActive(false);
            setReconnectPrompt(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (!gracePeriodActive && graceTimerRef.current) {
      clearInterval(graceTimerRef.current);
    }

    return () => {
      if (graceTimerRef.current) {
        clearInterval(graceTimerRef.current);
      }
    };
  }, [gracePeriodActive, gracePeriodRemaining]);

  // Parse meeting datetime and calculate time until session
  useEffect(() => {
    if (!activeSession?.booking) return;

    const meeting = activeSession.booking;
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
  }, [activeSession]);

  // Set up meeting status polling
  useEffect(() => {
    const pollMeetingStatus = async () => {
      if (!activeSession?.booking?._id || !hasJoinedSuccessfully) return;
      
      try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) return;
        
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/session/${activeSession.booking._id}/status`,
          {
            credentials:'include'
          }
        );
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setMeetingStatus(data.meeting);
            
            // Update client status based on backend data
            if (data.meeting.clientJoined !== clientStatus.joined) {
              setClientStatus(prev => ({
                ...prev,
                joined: data.meeting.clientJoined
              }));
            }
            
            // Check grace period
            if (data.meeting.graceActive && data.meeting.gracePeriodRemaining) {
              setGracePeriodActive(true);
              setGracePeriodRemaining(data.meeting.gracePeriodRemaining);
            } else if (!data.meeting.graceActive && gracePeriodActive) {
              setGracePeriodActive(false);
              setGracePeriodRemaining(0);
            }
          }
        }
      } catch (err) {
        console.error('Error polling meeting status:', err);
      }
    };

    if (hasJoinedSuccessfully && activeSession?.booking?._id) {
      // Initial poll
      pollMeetingStatus();
      
      // Set up interval for polling
      if (statusPollingTimerRef.current) {
        clearInterval(statusPollingTimerRef.current);
      }
      
      statusPollingTimerRef.current = setInterval(pollMeetingStatus, 10000); // Poll every 10 seconds
    } else if (!hasJoinedSuccessfully && statusPollingTimerRef.current) {
      clearInterval(statusPollingTimerRef.current);
    }

    return () => {
      if (statusPollingTimerRef.current) {
        clearInterval(statusPollingTimerRef.current);
      }
    };
  }, [activeSession, hasJoinedSuccessfully, clientStatus.joined, gracePeriodActive]);

  // Call frame event listeners with improved error handling
  useEffect(() => {
    let meetingEndedTimeout: NodeJS.Timeout;

    if (callFrame) {
      console.log('Setting up Daily.co event listeners');
      callFrame
        .on('joined-meeting', () => {
          console.log('Successfully joined meeting as counselor');
          setHasJoinedSuccessfully(true);
          
          // Notify server that counselor has joined
          notifyServerJoined();
          
          // Set a delay to ensure we're fully joined before allowing UI interactions
          setTimeout(() => {
            setIsFullyJoined(true);
            console.log('Session is now fully joined and stable');
          }, 1000);
        })
        .on('left-meeting', (event) => {
          console.log('Left meeting event:', event);
          // Only handle the left-meeting event if we successfully joined first
          if (hasJoinedSuccessfully && !leaveInProgressRef.current) {
            console.log('Processing left-meeting event - session was joined');
            handleEndCallConfirmation();
          } else {
            console.log('Ignoring left-meeting event - session was never joined or leave in progress');
          }
        })
        .on('participant-joined', (event: any) => {
          // If participant is not the local user (i.e., it's the client)
          if (event?.participant?.user_id !== 'local') {
            console.log('Client joined the meeting:', event);
            setClientStatus({ joined: true });
          }
        })
        .on('participant-left', (event: any) => {
          // If participant is not the local user (i.e., it's the client)
          if (event?.participant?.user_id !== 'local') {
            console.log('Client left the meeting:', event);
            setClientStatus({ joined: false });
          }
        })
        .on('error', (e) => {
          console.error('Daily.co error:', e);
          setError(`Connection error: ${e.message || 'Failed to connect to meeting room'}. Please try refreshing.`);
        })
        .on('meeting-ended', () => {
          console.log('Meeting ended event received');
          if (hasJoinedSuccessfully) {
            meetingEndedTimeout = setTimeout(() => handleEndCallConfirmation(), 2000);
          }
        });
    }

    return () => {
      if (meetingEndedTimeout) {
        clearTimeout(meetingEndedTimeout);
      }
      
      // IMPORTANT: Don't destroy the frame here
      console.log('Effect cleanup triggered but NOT destroying frame to prevent race conditions');
    };
  }, [callFrame, hasJoinedSuccessfully]);

  // Timer for session end warning and auto-ending call
  useEffect(() => {
    if (!callFrame || !activeSession?.booking?.meetingDate || !activeSession?.booking?.meetingTime || !hasJoinedSuccessfully) return;

    const meetingDateTime = parseMeetingDateTime(activeSession.booking);
    if (!meetingDateTime) return;

    const sessionEndTime = addMinutes(meetingDateTime, 45);
    const now = new Date().getTime();
    const timeUntilEnd = sessionEndTime.getTime() - now;
    const timeUntilWarning = timeUntilEnd - (5 * 60 * 1000); // 5 minutes before end

    if (timeUntilEnd <= 0) {
      handleEndCallConfirmation();
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
      handleEndCallConfirmation();
    }, timeUntilEnd);

    return () => {
      clearTimeout(warningTimer);
      clearTimeout(endCallTimer);
    };
  }, [callFrame, activeSession?.booking, hasJoinedSuccessfully]);

  const handleDailyLoad = () => {
    console.log('Daily.co SDK loaded successfully');
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
  
    // Log for debugging - include timezone info
    console.log('Session window check:', {
      now: now.toISOString(),
      nowLocal: now.toString(),
      sessionStart: sessionStart.toISOString(),
      sessionStartLocal: sessionStart.toString(),
      sessionEnd: sessionEnd.toISOString(),
      sessionEndLocal: sessionEnd.toString(),
      browserTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timezoneOffset: now.getTimezoneOffset() / 60, // Convert to hours
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

  // Notify server that counselor has joined the session
  const notifyServerJoined = async () => {
    if (!activeSession?.booking?._id) return;
    
    try {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) return;
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/participant/${activeSession.booking._id}/join`,
        {
          method: 'POST',
          credentials:'include',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.ok) {
        console.log('Successfully notified server of join status');
      }
    } catch (err) {
      console.error('Error notifying server of join status:', err);
    }
  };

  // Notify server that counselor has left the session
  const notifyServerLeft = async (skipGracePeriod: boolean = false) => {
    if (!activeSession?.booking?._id) return;
    
    try {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) return;
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/participant/${activeSession.booking._id}/leave`,
        {
          method: 'POST',
          credentials:'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            gracePeriod: !skipGracePeriod
          })
        }
      );
      
      if (response.ok) {
        console.log('Successfully notified server of leave status');
        const data = await response.json();
        
        // If grace period is active, update UI
        if (data.graceActive) {
          setGracePeriodActive(true);
          if (data.graceEndTime) {
            const endTime = new Date(data.graceEndTime).getTime();
            const now = new Date().getTime();
            setGracePeriodRemaining(Math.floor((endTime - now) / 1000));
          }
        }
      }
    } catch (err) {
      console.error('Error notifying server of leave status:', err);
    }
  };

  const handleEndCallConfirmation = () => {
    if (isFullyJoined) {
      setShowLeaveConfirmation(true);
    } else {
      // If we haven't fully joined, just end the call without confirmation
      handleEndCall();
    }
  };

  // Function to cancel the leave confirmation and resume session
  const handleCancelLeave = () => {
    setShowLeaveConfirmation(false);
  };

  const getMeetingAccess = async () => {
    if (!activeSession?.booking?._id) {
      setError('No active booking found');
      return;
    }

    if (!isDailyLoaded) {
      setError('Video conferencing SDK not loaded. Please refresh the page.');
      return;
    }

    setIsJoining(true);
    setError('');
    setHasJoinedSuccessfully(false);
    setIsFullyJoined(false);
    leaveInProgressRef.current = false;

    try {
      // Get access token from localStorage
      const accessToken = localStorage.getItem('access_token');
      
      if (!accessToken) {
        throw new Error('Authentication token not found. Please log in again.');
      }

      console.log(`Requesting meeting token for meeting: ${activeSession.booking._id}`);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/meeting-token/${activeSession.booking._id}`, 
        {
          credentials:'include'
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get meeting access');
      }
      
      const data = await response.json();
      console.log('Meeting token received', { roomUrl: data.roomUrl });

      console.log('Creating Daily.co frame...');
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
        dailyConfig: {
          experimentalChromeVideoMuteLightOff: true,
        }
      });

      console.log('Daily.co frame created, setting up event listeners...');
      
      // Set call frame first so event listeners in the useEffect can be attached
      setCallFrame(frame);
      
      // Wait a moment for event listeners to be set up
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Now join the meeting
      console.log('Joining meeting...');
      await frame.join({ 
        url: data.roomUrl, 
        token: data.token
      });
      console.log('Join command sent to Daily.co');

    } catch (err) {
      console.error('Meeting access error:', err);
      setError(err instanceof Error ? err.message : 'Failed to join meeting. Please try again.');
      
      // Clean up frame without using leave()
      if (callFrame) {
        try {
          await callFrame.destroy();
        } catch (destroyErr) {
          console.error('Error destroying frame:', destroyErr);
        }
        setCallFrame(null);
      }
    } finally {
      setIsJoining(false);
    }
  };

  const handleEndCall = async (skipGracePeriod: boolean = false) => {
    console.log('Handling end call, hasJoinedSuccessfully:', hasJoinedSuccessfully);
    setShowLeaveConfirmation(false);
    leaveInProgressRef.current = true;
    
    try {
      // Notify server before we disconnect (so grace period can start if needed)
      if (hasJoinedSuccessfully) {
        await notifyServerLeft(skipGracePeriod);
      }
      
      if (callFrame) {
        console.log('Leaving call...');
        try {
          await callFrame.leave();
          console.log('Successfully left call');
        } catch (leaveErr) {
          console.error('Error leaving call, destroying frame instead:', leaveErr);
          try {
            await callFrame.destroy();
          } catch (destroyErr) {
            console.error('Error destroying frame:', destroyErr);
          }
        }
        setCallFrame(null);
      }
      
      // Only fully complete the session if we're skipping grace period
      if (hasJoinedSuccessfully && activeSession?.booking?._id && skipGracePeriod) {
        console.log('Completing session (skipping grace period)...');
        const accessToken = localStorage.getItem('access_token');
        
        if (!accessToken) {
          throw new Error('Authentication token not found');
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/complete-extended/${activeSession.booking._id}`, 
          {
            method: 'POST',
            credentials:'include',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              forceComplete: true,
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
          
          // Navigate to history page after successful completion
          await router.push('/counselor/history');
          setTimeout(() => {
            window.location.reload();
          }, 100);
        }
      } else if (!hasJoinedSuccessfully) {
        console.log('Session was never successfully joined, not marking as completed');
        // Just clear the UI and error state
        setError('');
      } else if (!skipGracePeriod) {
        // Just close the call frame, but don't navigate away - show grace period UI
        setHasJoinedSuccessfully(false);
        setIsFullyJoined(false);
        
        // We'll wait for server to tell us about grace period via socket
      }
    } catch (err) {
      console.error('Error ending call:', err);
      setError('Failed to end call properly. Please try again.');
    } finally {
      leaveInProgressRef.current = false;
    }
  };

  const handleForceComplete = async () => {
    if (!activeSession?.booking?._id) return;
    
    try {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) return;
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/complete-extended/${activeSession.booking._id}`,
        {
          method: 'POST',
          credentials:'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            forceComplete: true,
            sessionDetails: {
              duration: 45,
              status: 'completed'
            }
          })
        }
      );
      
      if (response.ok) {
        console.log('Successfully force completed session');
        toast.success('Session has been completed');
        
        // Navigate to history page
        setTimeout(() => {
          router.push('/counselor/history');
        }, 1000);
      }
    } catch (err) {
      console.error('Error force completing session:', err);
      setError('Failed to complete session. Please try again.');
    }
  };

  // Helper to rejoin session during grace period
  const handleRejoinSession = () => {
    setGracePeriodActive(false);
    setReconnectPrompt(false);
    getMeetingAccess();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!activeSession?.booking || !['confirmed', 'time_selected'].includes(activeSession.booking.status)) {
    return (
      <Card className="max-w-2xl mx-auto mt-8">
        <CardHeader>
          <CardTitle>No Active Session</CardTitle>
          <CardDescription>
            {activeSession?.booking?.status === 'abandoned' 
              ? 'This session was marked as abandoned because neither party joined within 15 minutes of the start time.'
              : "You don't have any confirmed sessions at the moment."}
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
  const sessionStatus = meetingDateTime ? getSessionStatus(meetingDateTime, meeting.status) : 'Error loading session time';

  // Render grace period UI when active
  if (gracePeriodActive && !callFrame) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Session Paused</CardTitle>
          <CardDescription>
            {meetingDateTime 
              ? `${format(meetingDateTime, 'EEEE, MMMM d, yyyy')} at ${format(meetingDateTime, 'h:mm a')}`
              : 'Session time - Please wait'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertTitle>Grace Period Active</AlertTitle>
            <AlertDescription>
              {reconnectPrompt 
                ? 'The client has left the session temporarily. They can rejoin within the grace period.'
                : 'Your session is in a grace period. You can rejoin or wait for the client to reconnect.'}
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Grace period remaining</span>
                <span>
                  {Math.floor(gracePeriodRemaining / 60)}:
                  {String(gracePeriodRemaining % 60).padStart(2, '0')}
                </span>
              </div>
              <Progress value={(gracePeriodRemaining / 300) * 100} /> {/* Assuming 5-minute grace period (300 seconds) */}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                className="flex-1"
                onClick={handleRejoinSession}
              >
                <RefreshCcw className="w-4 h-4 mr-2" />
                Rejoin Session
              </Button>
              
              <Button 
                variant="destructive" 
                className="flex-1"
                onClick={() => handleEndCall(true)} // Skip grace period
              >
                End Session Now
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

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
                <h3 className="font-medium mb-2">Counselor Guidelines</h3>
                <ul className="space-y-2 text-sm">
                  <li>• This is an anonymous voice session - video is disabled</li>
                  <li>• Session duration is 45 minutes</li>
                  <li>• Use the chat feature for sharing resources if needed</li>
                  <li>• Ensure you're in a quiet, professional environment</li>
                  <li>• Join 5 minutes before the scheduled time</li>
                  <li>• Maintain strict client confidentiality</li>
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

      {/* Leave Session Confirmation Dialog */}
      {showLeaveConfirmation && (
        <div className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">End Session</h3>
            <p className="mb-6">Are you sure you want to leave this counseling session? You can rejoin during the grace period if needed.</p>
            <div className="flex justify-end space-x-4">
              <Button 
                variant="outline" 
                onClick={handleCancelLeave}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => handleEndCall(false)} // Use grace period
              >
                Leave Session
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CounselorSessionPage;