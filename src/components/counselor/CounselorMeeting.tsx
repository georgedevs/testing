import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import {
  AlertCircle,
  Calendar,
  Clock,
  Loader2,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  useAcceptMeetingMutation, 
  useCancelCounselorMeetingMutation, 
  useGetCounselorMeetingsQuery, 
  useGetPendingMeetingsQuery 
} from '@/redux/feautures/booking/bookingApi';
import { useSocket } from '@/components/SocketProvider';

interface CounselorMeeting {
  _id: string;
  clientId: {
    username: string;
  };
  meetingType: 'virtual' | 'physical';
  issueDescription: string;
  meetingDate: string;
  meetingTime: string;
  status: 'confirmed' | 'cancelled' | 'pending';
}

interface MeetingsResponse {
  success: boolean;
  meetings: CounselorMeeting[];
}

export default function CounselorMeetings() {
  const socket = useSocket();
  const { data: meetings, isLoading, refetch: refetchMeetings } = useGetCounselorMeetingsQuery<{
    data: MeetingsResponse;
    isLoading: boolean;
  }>();
  
  const { 
    data: pendingMeetings, 
    isLoading: loadingPending, 
    refetch: refetchPending 
  } = useGetPendingMeetingsQuery<{
    data: MeetingsResponse;
    isLoading: boolean;
  }>();
  
  const [acceptMeeting] = useAcceptMeetingMutation();
  const [cancelMeeting] = useCancelCounselorMeetingMutation();
  
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const pendingMeetingsCount = pendingMeetings?.meetings?.length ?? 0;
  const allMeetingsCount = meetings?.meetings?.length ?? 0;

  useEffect(() => {
    if (!socket) return;

    const handleMeetingUpdate = () => {
      refetchMeetings();
      refetchPending();
    };

    const events = [
      'new_assignment',
      'meeting_confirmed',
      'meeting_cancelled',
      'time_selected',
      'booking_updated'
    ];

    events.forEach(event => {
      socket.on(event, handleMeetingUpdate);
    });

    return () => {
      events.forEach(event => {
        socket.off(event, handleMeetingUpdate);
      });
    };
  }, [socket, refetchMeetings, refetchPending]);

  const handleAccept = async (meetingId: string) => {
    try {
      setIsProcessing(true);
      setError('');
      await acceptMeeting({ meetingId }).unwrap();
      await Promise.all([refetchMeetings(), refetchPending()]);
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      setError(error.data?.message ?? 'Failed to accept meeting');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = async () => {
    if (!selectedMeeting) return;

    try {
      setIsProcessing(true);
      setError('');
      await cancelMeeting({
        meetingId: selectedMeeting,
        cancellationReason: cancelReason
      }).unwrap();
      await Promise.all([refetchMeetings(), refetchPending()]);
      setShowCancelDialog(false);
      setCancelReason('');
      setSelectedMeeting(null);
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      setError(error.data?.message ?? 'Failed to cancel meeting');
    } finally {
      setIsProcessing(false);
    }
  };

  const openCancelDialog = (meetingId: string) => {
    setSelectedMeeting(meetingId);
    setShowCancelDialog(true);
  };

  const renderMeetingStatus = (status: CounselorMeeting['status']) => {
    const variants = {
      confirmed: 'default',
      cancelled: 'destructive',
      pending: 'secondary'
    } as const;

    return (
      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        status === 'confirmed' ? 'bg-green-100 text-green-800' :
        status === 'cancelled' ? 'bg-red-100 text-red-800' :
        'bg-gray-100 text-gray-800'
      }`}>
        {status.replace('_', ' ').toUpperCase()}
      </div>
    );
  };

  if (isLoading || loadingPending) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const renderMeetingCard = (meeting: CounselorMeeting, isPending: boolean) => (
    <Card key={meeting._id} className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Meeting with {meeting.clientId.username}</CardTitle>
            <CardDescription className="mt-1">
              {meeting.meetingType === 'virtual' ? 'Virtual Session' : 'Physical Session'}
            </CardDescription>
          </div>
          {!isPending && renderMeetingStatus(meeting.status)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="font-medium">Issue Description</p>
            <p className="text-sm text-gray-500">{meeting.issueDescription}</p>
          </div>
          
          {meeting.meetingDate && meeting.meetingTime && (
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <p>{format(new Date(meeting.meetingDate), 'PPP')}</p>
              <Clock className="h-4 w-4 ml-2" />
              <p>{meeting.meetingTime}</p>
            </div>
          )}

          {isPending ? (
            <div className="flex space-x-4">
              <Button
                onClick={() => handleAccept(meeting._id)}
                disabled={isProcessing}
                className="flex items-center"
              >
                {isProcessing ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle className="mr-2 h-4 w-4" />
                )}
                Accept
              </Button>
              <Button
                variant="destructive"
                onClick={() => openCancelDialog(meeting._id)}
                disabled={isProcessing}
                className="flex items-center"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Decline
              </Button>
            </div>
          ) : (
            meeting.status !== 'cancelled' && (
              <Button
                variant="destructive"
                onClick={() => openCancelDialog(meeting._id)}
                disabled={isProcessing}
                className="flex items-center"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Cancel Meeting
              </Button>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="pending" className="w-full">
        <TabsList>
          <TabsTrigger value="pending">
            Pending Requests {pendingMeetingsCount > 0 && `(${pendingMeetingsCount})`}
          </TabsTrigger>
          <TabsTrigger value="all">
            All Meetings {allMeetingsCount > 0 && `(${allMeetingsCount})`}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <div className="grid gap-4">
            {!pendingMeetingsCount ? (
              <Card>
                <CardContent className="flex items-center justify-center h-32">
                  <p className="text-gray-500">No pending requests</p>
                </CardContent>
              </Card>
            ) : (
              pendingMeetings?.meetings.map(meeting => renderMeetingCard(meeting, true))
            )}
          </div>
        </TabsContent>

        <TabsContent value="all">
          <div className="grid gap-4">
            {!allMeetingsCount ? (
              <Card>
                <CardContent className="flex items-center justify-center h-32">
                  <p className="text-gray-500">No meetings found</p>
                </CardContent>
              </Card>
            ) : (
              meetings?.meetings.map(meeting => renderMeetingCard(meeting, false))
            )}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Meeting</DialogTitle>
            <DialogDescription>
              Please provide a reason for cancellation
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <textarea
              className="w-full p-2 border rounded"
              placeholder="Reason for cancellation"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />

            <Button 
              variant="destructive" 
              className="w-full"
              onClick={handleCancel}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cancelling...
                </>
              ) : (
                'Confirm Cancellation'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}