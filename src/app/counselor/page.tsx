"use client"
import React from 'react'
import Heading from '@/components/Heading'
import { DashboardHeader } from '@/components/counselor/DashboardHeader'
import { CounselorSidebar } from '@/components/counselor/CounselorSidebar'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { Loader2 } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { useLoadUserQuery } from '@/redux/feautures/api/apiSlice'
import { useAvatarCheck } from '../hooks/useAvatarCheck'
import { AvatarSelectionModal } from '@/components/AvatarSelectionModal'
import DashboardContent from '@/components/counselor/DashboardContent'
import CounselorDashboardTour from '@/components/counselor/CounselorDashboardTour'

const CounselorDashboardPage = () => {
  const { isAuthenticated, userRole } = useAuth();
  const user = useSelector((state: RootState) => state.auth.user);
  const { data: userData, refetch: refetchUser, isLoading: userDataLoading } = useLoadUserQuery((undefined), {
    skip: !isAuthenticated,
  });
  
  const isLoadingUser = userDataLoading;
  
  const { 
    showAvatarModal, 
    setShowAvatarModal, 
    requiresAvatar, 
    handleAvatarUpdated,
    isReady
  } = useAvatarCheck();

  const handleModalClose = () => {
    if (!requiresAvatar) {
      setShowAvatarModal(false);
    }
  };
  
  if (isLoadingUser) return (
    <div className="flex items-center justify-center h-screen w-full">
      <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
    </div>
  );

  return (
    <>
      <ProtectedRoute allowedRoles={['counselor']}>
        <CounselorDashboardTour 
          isAvatarModalOpen={showAvatarModal} 
          isLoadingUser={isLoadingUser || !isReady}
        >
          <Heading 
            title="Counselor Dashboard"
            description="MiCounselor Counselor Dashboard"
            keywords="counselor, dashboard, counseling, therapy"
          />
          <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900">
            <DashboardHeader />
            <CounselorSidebar />
            <main className="lg:ml-72 p-4 lg:p-6 lg:mt-16 mt-6 ">
              <div className="max-w-screen-2xl mx-auto space-y-6">
                <div className="p-6 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl shadow-gray-900/10">
                  <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent mb-4">
                    Welcome back{user?.fullName ? `, ${user.fullName}` : ''}!
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Manage your sessions and view client appointments from your counselor dashboard.
                  </p>
                </div>
                <DashboardContent user={user} />
              </div>
            </main>
          </div>
        </CounselorDashboardTour>
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

export default CounselorDashboardPage;