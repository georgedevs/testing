"use client"
import React, { useEffect } from 'react'
import Heading from '@/components/Heading'
import { DashboardHeader } from '@/components/admin/DashboardHeader'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { Loader } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { useLoadUserQuery } from '@/redux/feautures/api/apiSlice'
import { useAvatarCheck } from '../hooks/useAvatarCheck'
import { AvatarSelectionModal } from '@/components/AvatarSelectionModal'
import AdminDashboardContent from '@/components/admin/AdminDashboardContent'

const AdminDashboardPage = () => {
  const { isAuthenticated, userRole, isLoading } = useAuth();
  const user = useSelector((state: RootState) => state.auth.user);
  const { data: userData, refetch: refetchUser } = useLoadUserQuery((undefined), {
    skip: !isAuthenticated
  });
  
  const { 
    showAvatarModal, 
    setShowAvatarModal, 
    requiresAvatar, 
    handleAvatarUpdated 
  } = useAvatarCheck();

  const handleModalClose = () => {
    if (!requiresAvatar) {
      setShowAvatarModal(false);
    }
  };
  
  
  if (isLoading) return <Loader />;

  return (
    <>
      <ProtectedRoute allowedRoles={['admin']}>
        <Heading 
          title="Admin Dashboard"
          description="MiCounselor Admin Dashboard"
          keywords="admin, dashboard, counseling, therapy"
        />
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900">
          <DashboardHeader />
          <AdminSidebar />
          <main className="lg:ml-72 p-4 lg:p-6 lg:mt-16 mt-4">
            <div className="max-w-screen-2xl mx-auto space-y-6">
              <div className="p-6 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl shadow-gray-900/10">
                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent mb-4">
                  Welcome back{user?.fullName ? `, ${user.fullName}` : ''}!
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Monitor and manage platform activities from your admin dashboard.
                </p>
              </div>
              <AdminDashboardContent user={user} />
            </div>
          </main>
        </div>
      </ProtectedRoute>
      
      <AvatarSelectionModal 
        open={showAvatarModal}
        onClose={handleModalClose}
        isRequired={requiresAvatar}
        onAvatarUpdated={handleAvatarUpdated}
      />
    </>
  );
};

export default AdminDashboardPage;