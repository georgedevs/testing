'use client'
import React, { useEffect } from 'react';
import Heading from '@/components/Heading';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardSidebar } from '@/components/dashboard/Sidebar';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import BookingForm from '@/components/dashboard/BookingForm';
import ActiveBooking from '@/components/dashboard/ActiveBooking';
import { useGetActiveBookingQuery } from '@/redux/feautures/booking/bookingApi';
import { useSocket } from '@/components/SocketProvider';

const BookingPage: React.FC = () => {
  const socket = useSocket();
  const { data: activeBooking, isLoading, refetch } = useGetActiveBookingQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true
  });

  useEffect(() => {
    if (!socket) return;

    const handleBookingUpdate = () => {
      console.log('Booking update received, refetching...');
      refetch();
    };

    const handleNewBooking = () => {
      console.log('New booking created, refetching...');
      refetch();
    };

    socket.on('booking_updated', handleBookingUpdate);
    socket.on('counselor_assigned', handleBookingUpdate);
    socket.on('booking_created', handleNewBooking);

    return () => {
      socket.off('booking_updated', handleBookingUpdate);
      socket.off('counselor_assigned', handleBookingUpdate);
      socket.off('booking_created', handleNewBooking);
    };
  }, [socket, refetch]);

  const handleBookingSuccess = async () => {
    console.log('Booking success, refetching...');
    await refetch();
  };

  return (
    <>
      <ProtectedRoute allowedRoles={['client']}>
        <Heading 
          title="Book Session"
          description="Book a counseling session"
          keywords="booking, counseling, therapy, session"
        />
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900">
          <DashboardHeader />
          <DashboardSidebar />
          <main className="lg:ml-72 p-4 lg:p-6 lg:mt-16 mt-4">
            <div className="max-w-screen-2xl mx-auto space-y-6">
              <div className="p-6 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl shadow-gray-900/10">
                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent mb-4">
                  {activeBooking?.booking ? 'Active Session' : 'Book a Session'}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {activeBooking?.booking 
                    ? 'View and manage your current counseling session.'
                    : 'Request a counseling session with one of our experienced professionals.'}
                </p>
              </div>
              
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="p-6 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50">
                  {activeBooking?.booking ? (
                    <ActiveBooking />
                  ) : (
                    <BookingForm onBookingSuccess={handleBookingSuccess} />
                  )}
                </div>
              )}
            </div>
          </main>
        </div>
      </ProtectedRoute>
    </>
  );
};

export default BookingPage;