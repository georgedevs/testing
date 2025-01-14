import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import {
  AlertCircle,
  Calendar,
  Clock,
  Loader2,
  MapPin,
  MessageCircle,
  User,
  Video,
  X
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
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetActiveBookingQuery, useGetAvailableTimeSlotsQuery, useSelectMeetingTimeMutation, useCancelBookingMutation } from '@/redux/feautures/booking/bookingApi';
import { useSocket } from '../SocketProvider';
import BookingProgress from './BookingProgress';
import { useRouter } from 'next/navigation';

export default function ActiveBooking() {
  const router = useRouter();
  const socket = useSocket();
  const { data: activeBooking, isLoading,refetch } = useGetActiveBookingQuery();
  const [selectTime] = useSelectMeetingTimeMutation();
  const [cancelBooking] = useCancelBookingMutation();
  
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const [showTimeSelection, setShowTimeSelection] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [error, setError] = useState('');
  const [isSelecting, setIsSelecting] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const { data: timeSlots, isLoading: loadingSlots } = useGetAvailableTimeSlotsQuery(
    {
      date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '',
      counselorId: activeBooking?.booking?.counselorId?._id || ''
    },
    {
      skip: !selectedDate || !activeBooking?.booking?.counselorId
    }
  );

  useEffect(() => {
    if (!socket) return;

    // Listen for booking-related updates
    const handleBookingUpdate = () => {
      refetch();
    };

    const handleCounselorAssigned = () => {
      refetch();
    };

    socket.on('booking_updated', handleBookingUpdate);
    socket.on('counselor_assigned', handleCounselorAssigned);

    return () => {
      socket.off('booking_updated', handleBookingUpdate);
      socket.off('counselor_assigned', handleCounselorAssigned);
    };
  }, [socket, refetch]);

  const handleTimeSelection = async () => {
    if (!selectedDate || !selectedTime || !activeBooking?.booking) return;

    try {
      setIsSelecting(true);
      setError('');
      await selectTime({
        meetingId: activeBooking.booking._id,
        meetingDate: format(selectedDate, 'yyyy-MM-dd'),
        meetingTime: selectedTime
      }).unwrap();
      setShowTimeSelection(false);
      setSelectedDate(undefined);
      setSelectedTime(undefined);
    } catch (err: any) {
      setError(err.data?.message || 'Failed to select time');
    } finally {
      setIsSelecting(false);
    }
  };

  const handleCancel = async () => {
    if (!activeBooking?.booking) return;

    try {
      setIsCancelling(true);
      setError('');
      await cancelBooking({
        meetingId: activeBooking.booking._id,
        cancellationReason: cancelReason
      }).unwrap();
      setShowCancelDialog(false);
      setCancelReason('');
    } catch (err: any) {
      setError(err.data?.message || 'Failed to cancel booking');
    } finally {
      setIsCancelling(false);
    }
  };

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(undefined);
  };

  const handleJoinSession = () => {
    router.push('/dashboard/session');
  };


  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!activeBooking?.booking) {
    return null;
  }

  const booking = activeBooking.booking;
  const canSelectTime = booking.status === 'counselor_assigned';

  return (
<Card>
<CardHeader>
        <CardTitle>Current Booking Request</CardTitle>
        <div className="">
          <BookingProgress status={booking.status} />
          {booking.status === 'counselor_assigned' && booking.counselorId && booking.autoAssigned && (
            <div className="flex justify-center py-2">
              <span className="text-sm text-blue-500 dark:text-blue-400">
                Automatically assigned based on your previous sessions
              </span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-500">Session Type</p>
          <p>{booking.meetingType === 'virtual' ? 'Virtual Session' : 'Physical Session'}</p>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-500">Issue Description</p>
          <p>{booking.issueDescription}</p>
        </div>

        {booking.counselorId && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500">Assigned Counselor</p>
            <div className="flex items-center">
              {booking.counselorId.avatar?.imageUrl ? (
                <img 
                  src={booking.counselorId.avatar.imageUrl} 
                  alt="Counselor"
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 text-lg">
                    {booking.counselorId.fullName?.charAt(0)}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {booking.meetingDate && booking.meetingTime && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500">Scheduled Time</p>
            <p>
              {format(new Date(booking.meetingDate), 'PPP')} at {booking.meetingTime}
            </p>
          </div>
        )}
 <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 pt-4">
          {canSelectTime && (
            <Button className="w-full sm:w-auto" onClick={() => setShowTimeSelection(true)}>
              Select Time
            </Button>
          )}
          {booking.status === 'confirmed' && (
            <Button 
              onClick={handleJoinSession}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
            >
              <Video className="w-4 h-4 mr-2" />
              Join Session
            </Button>
          )}
          <Button
            variant="destructive"
            onClick={() => setShowCancelDialog(true)}
            className="w-full sm:w-auto"
          >
            Cancel Booking
          </Button>
        </div>
      </CardContent>

      {/* Time Selection Dialog */}
      <Dialog open={showTimeSelection} onOpenChange={setShowTimeSelection}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Meeting Time</DialogTitle>
            <DialogDescription>
              Choose your preferred date and time
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex justify-center">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={handleDateChange}
                disabled={(date) => date < new Date()}
                className="rounded-md border"
              />
            </div>

            {selectedDate && (
              <div className="space-y-2">
                {loadingSlots ? (
                  <div className="flex justify-center p-2">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                  </div>
                ) : timeSlots?.availableSlots && timeSlots.availableSlots.length > 0 ? (
                  <Select
                    value={selectedTime}
                    onValueChange={setSelectedTime}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.availableSlots.map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          {slot}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {timeSlots?.error || 'No available time slots for this date'}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            <Button 
              className="w-full" 
              onClick={handleTimeSelection}
              disabled={!selectedDate || !selectedTime || loadingSlots || isSelecting}
            >
              {isSelecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Confirming...
                </>
              ) : (
                'Confirm Time'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this booking?
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
              disabled={isCancelling}
            >
              {isCancelling ? (
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
    </Card>
  );
}