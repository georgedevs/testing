import React, { useState, useEffect } from 'react';
import { AlertCircle, Loader2, MapPin, PhoneCall, Video, MessageSquareText } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from '@/components/ui/textarea';
import { useInitiateBookingMutation } from '@/redux/feautures/booking/bookingApi';
import { useSocket } from '../SocketProvider';
import { useLoadUserQuery } from '@/redux/feautures/api/apiSlice';

interface BookingFormProps {
  onBookingSuccess?: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ onBookingSuccess }) => {
  const [meetingType, setMeetingType] = useState<'virtual' | 'physical'>('virtual');
  const [issueDescription, setIssueDescription] = useState('');
  const [usePreviousCounselor, setUsePreviousCounselor] = useState(true);
  const [error, setError] = useState('');
  
  const socket = useSocket();
  const { data: userData, isLoading: isUserLoading } = useLoadUserQuery();
  const [initiateBooking, { isLoading }] = useInitiateBookingMutation();

  // Log when user data changes
  useEffect(() => {
    console.log('User Data Updated:', {
      userData,
      currentCounselor: userData?.user?.currentCounselor,
      isUserLoading,
      usePreviousCounselor
    });
  }, [userData, isUserLoading, usePreviousCounselor]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Enhanced debug logging
    const hasCurrentCounselor = !!userData?.user?.currentCounselor;
    const shouldUseCurrentCounselor = hasCurrentCounselor && usePreviousCounselor;
    
    console.log('Submit Data:', {
      meetingType,
      issueDescription,
      usePreviousCounselor,
      hasCurrentCounselor,
      shouldUseCurrentCounselor,
      currentCounselorId: userData?.user?.currentCounselor?._id || "Not set",
      currentCounselorData: userData?.user?.currentCounselor
    });
    
    if (!issueDescription.trim()) {
      setError('Please describe your issue');
      return;
    }

    try {
      const response = await initiateBooking({
        meetingType,
        issueDescription: issueDescription.trim(),
        usePreviousCounselor: shouldUseCurrentCounselor
      }).unwrap();

      console.log('Booking Response:', response);

      setMeetingType('virtual');
      setIssueDescription('');
      setUsePreviousCounselor(true);

      if (socket) {
        socket.emit('booking_created', { type: 'new_booking' });
      }

      onBookingSuccess?.();
      
    } catch (err: any) {
      console.error('Booking Error:', err);
      setError(err.data?.message || 'Something went wrong');
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Book a Counseling Session</CardTitle>
        <CardDescription className="text-base">
          Choose your preferred session type and we'll guide you through the booking process.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {userData?.user?.currentCounselor && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="usePreviousCounselor"
                checked={usePreviousCounselor}
                onCheckedChange={(checked) => setUsePreviousCounselor(checked as boolean)}
              />
              <label
                htmlFor="usePreviousCounselor"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Book with your previous counselor ({userData.user.currentCounselor.fullName || 'Unknown'})
              </label>
            </div>
          )}
          
          <div className="space-y-4">
            <label className="text-sm font-medium">Session Type</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setMeetingType('virtual')}
                className={`p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center space-y-3 hover:border-blue-400 ${
                  meetingType === 'virtual'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <Video className={`h-8 w-8 ${
                  meetingType === 'virtual' ? 'text-blue-500' : 'text-gray-500'
                }`} />
                <div className="text-center">
                  <h3 className="font-semibold">Virtual Session</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Online counseling from your comfort
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMeetingType('physical')}
                className={`p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center space-y-3 hover:border-blue-400 ${
                  meetingType === 'physical'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <MapPin className={`h-8 w-8 ${
                  meetingType === 'physical' ? 'text-blue-500' : 'text-gray-500'
                }`} />
                <div className="text-center">
                  <h3 className="font-semibold">Physical Session</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    In-person counseling at our center
                  </p>
                </div>
              </button>
            </div>
          </div>

          {meetingType === 'virtual' ? (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Describe Your Issue</label>
                <Textarea
                  value={issueDescription}
                  onChange={(e) => setIssueDescription(e.target.value)}
                  placeholder="Please describe what you'd like to discuss..."
                  className="min-h-[150px]"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Your information will be kept confidential and shared only with your assigned counselor.
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting Request...
                  </>
                ) : (
                  'Request Virtual Session'
                )}
              </Button>
            </>
          ) : (
            <div className="mt-6 space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-lg">
                {/* Physical session booking content */}
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-blue-500" />
                  Physical Session Booking
                </h3>
                
                <div className="space-y-4">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                    <h4 className="font-medium mb-2 flex items-center">
                      <PhoneCall className="h-4 w-4 mr-2 text-blue-500" />
                      Contact Information
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                      For physical sessions, please reach out to our booking coordinator:
                    </p>
                    <div className="flex flex-col space-y-2">
                      <a 
                        href="https://wa.me/1234567890" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors w-fit"
                      >
                        <svg 
                          className="h-5 w-5 mr-2" 
                          fill="currentColor" 
                          xmlns="http://www.w3.org/2000/svg" 
                          viewBox="0 0 448 512"
                        >
                          <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                        </svg>
                        Chat on WhatsApp
                      </a>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Business hours: Mon-Fri, 9:00 AM - 5:00 PM
                      </p>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                    <h4 className="font-medium mb-2 flex items-center">
                      <MessageSquareText className="h-4 w-4 mr-2 text-blue-500" />
                      What to Expect
                    </h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                      <li>• Prompt response within 2 business hours</li>
                      <li>• Flexible scheduling options</li>
                      <li>• Initial consultation to understand your needs</li>
                      <li>• Location and counselor preferences discussed</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default BookingForm;