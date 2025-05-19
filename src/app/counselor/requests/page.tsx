
"use client"
import React from 'react';
import Heading from '@/components/Heading';
import { DashboardHeader } from '@/components/counselor/DashboardHeader';
import { CounselorSidebar } from '@/components/counselor/CounselorSidebar';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Loader } from 'lucide-react';
import { useAuth } from '@/app/hooks/useAuth';
import CounselorMeetings from '@/components/counselor/CounselorMeeting';

const CounselorMeetingsPage = () => {
  const { isAuthenticated, userRole, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <>
      <ProtectedRoute allowedRoles={['counselor']}>
        <Heading 
          title="Meetings Management"
          description="Manage your counseling sessions and appointments"
          keywords="counselor, meetings, appointments, sessions, therapy"
        />
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900">
          <DashboardHeader />
          <CounselorSidebar />
          <main className="lg:ml-72 p-4 lg:p-6 lg:mt-16 mt-4">
            <div className="max-w-screen-2xl mx-auto">
              <div className="p-4 lg:p-8 rounded-xl lg:rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl shadow-gray-900/10">
                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent mb-6">
                  Meetings Management
                </h1>
                <CounselorMeetings />
              </div>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    </>
  );
};

export default CounselorMeetingsPage;