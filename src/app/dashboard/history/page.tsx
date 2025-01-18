"use client"
import React from 'react';
import Heading from '@/components/Heading';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardSidebar } from '@/components/dashboard/Sidebar';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import SessionHistory from '@/components/dashboard/SessionHistory';

const HistoryPage = () => {
  return (
    <ProtectedRoute allowedRoles={['client']}>
      <Heading 
        title="Session History"
        description="View your counseling session history"
        keywords="counseling, history, sessions, therapy"
      />
      <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900">
        <DashboardHeader />
        <DashboardSidebar />
        <main className="lg:ml-72 p-4 lg:p-6 lg:mt-16 mt-4">
          <div className="max-w-screen-2xl mx-auto space-y-6">
            <div className="p-6 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl shadow-gray-900/10">
              <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent mb-4">
                Session History
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                View and track your counseling journey
              </p>
            </div>
            
            <div className="p-6 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50">
              <SessionHistory />
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default HistoryPage;