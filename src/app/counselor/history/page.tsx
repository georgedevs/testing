// app/dashboard/history/page.tsx
"use client"
import React from 'react';
import Heading from '@/components/Heading';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import CounselorSessionHistory from '@/components/counselor/CounselorSessionHistory';
import { DashboardHeader } from '@/components/counselor/DashboardHeader';
import { CounselorSidebar } from '@/components/counselor/CounselorSidebar';

const HistoryPage = () => {
  return (
    <ProtectedRoute allowedRoles={['counselor']}>
      <Heading 
        title="Session History"
        description="View your counseling session history"
        keywords="counseling, history, sessions, therapy"
      />
      <DashboardHeader/>
      <CounselorSidebar/>
      <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900">
      <main className="lg:ml-72 p-4 lg:p-6 lg:mt-16 mt-4">
          <div className="max-w-screen-2xl mx-auto space-y-6">
            {/* Header Section with matching style */}
            <div className="p-6 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl shadow-gray-900/10">
              <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent mb-4">
                Session History Overview
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Track and monitor your counseling sessions and client interactions
              </p>
            </div>
            
            <CounselorSessionHistory/>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default HistoryPage;