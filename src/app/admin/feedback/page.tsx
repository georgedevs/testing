"use client"
import React from 'react';
import Heading from '@/components/Heading';
import { DashboardHeader } from '@/components/admin/DashboardHeader';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import FeedbackList from '@/components/admin/FeedbackList';

const FeedbackPage = () => {
  return (
    <>
      <ProtectedRoute allowedRoles={['admin']}>
        <Heading 
          title="Session Feedback"
          description="View and analyze client feedback and ratings"
          keywords="admin, feedback, ratings, client satisfaction"
        />
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900">
          <DashboardHeader />
          <AdminSidebar />
          <main className="lg:ml-72 pt-16 p-4 lg:p-6 lg:mt-16 mt-4">
            <div className="max-w-screen-2xl mx-auto">
              <div className="p-6 lg:p-8 rounded-xl lg:rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl shadow-gray-900/10">
                <div className="mb-8">
                  <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                    Session Feedback
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    Review client feedback and counseling session ratings
                  </p>
                </div>
                <FeedbackList />
              </div>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    </>
  );
};

export default FeedbackPage;