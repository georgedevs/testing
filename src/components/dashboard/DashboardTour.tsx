import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Loader2 } from 'lucide-react';
import { useUpdateTourStatusMutation } from '@/redux/feautures/user/userApi';

// Dynamically import Joyride to avoid SSR issues
const Joyride = dynamic(
  () => import('react-joyride').then((mod) => mod.default),
  { ssr: false }
);

interface DashboardTourProps {
  children: React.ReactNode;
  isAvatarModalOpen: boolean;
  isLoadingUser: boolean;
}

const DashboardTour: React.FC<DashboardTourProps> = ({ 
  children, 
  isAvatarModalOpen,
  isLoadingUser = false
}) => {
  const [runTour, setRunTour] = useState(false);
  const [isTourReady, setIsTourReady] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const user = useSelector((state: RootState) => state.auth.user);
  const [updateTourStatus] = useUpdateTourStatusMutation();

  // Only set tour ready when we have definitive user data
  useEffect(() => {
    if (!isLoadingUser && user) {
      setIsTourReady(true);
      if (!user.tourViewed && !isAvatarModalOpen && user.avatar) {
        setRunTour(true);
      }
    }
  }, [isLoadingUser, user, isAvatarModalOpen]);

  const steps = [
    {
      target: '[data-tutorial="notifications"]',
      content: 'Get notified about your upcoming sessions and important updates',
      disableBeacon: true,
    },
    {
      target: '[data-tutorial="profile-menu"]',
      content: 'Access your profile settings and account options',
    },
    {
      target: '[data-tutorial="profile-completion"]',
      content: 'Complete your profile to get the most out of our counseling services',
    },
    {
      target: '[data-tutorial="book-meeting"]',
      content: 'Schedule your counseling sessions at your convenience',
    },
    {
      target: '[data-tutorial="join-session"]',
      content: 'Join your scheduled counseling sessions with just one click',
    },
    {
      target: '[data-tutorial="meeting-history"]',
      content: 'View your past sessions and track your progress',
    },
    {
      target: '[data-tutorial="feedback"]',
      content: 'Share your feedback to help us improve our services',
    }
  ];

  const tourStyles = {
    options: {
      primaryColor: '#2563eb',
      zIndex: 9999,
      arrowColor: '#fff',
      backgroundColor: '#fff',
      overlayColor: 'rgba(0, 0, 0, 0.75)',
      textColor: '#1f2937'
    },
    tooltipContainer: {
      textAlign: 'left' as const
    },
    buttonNext: {
      backgroundColor: '#2563eb'
    },
    buttonBack: {
      marginRight: 10
    },
    spotlight: {
      backgroundColor: 'transparent'
    }
  };

  const handleTourCallback = async (data: any) => {
    const { status, type } = data;
  
    if ((type === 'tour:end' && status === 'finished') || status === 'skipped') {
      setIsUpdating(true);
      try {
        const result = await updateTourStatus().unwrap();
        if (result.success) {
          setRunTour(false);
        }
      } catch (error) {
        console.error('Failed to update tour status:', error);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  return (
    <>
      {isUpdating && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <Loader2 className="animate-spin text-white w-8 h-8" />
        </div>
      )}
      
      {isTourReady && !user?.tourViewed && (
        <Joyride
          steps={steps}
          run={runTour}
          continuous
          showProgress
          showSkipButton
          spotlightClicks={false}
          disableOverlayClose
          hideCloseButton
          callback={handleTourCallback}
          styles={tourStyles}
          floaterProps={{
            disableAnimation: true,
            placement: 'auto'
          }}
          locale={{
            back: 'Previous',
            close: 'Close',
            last: 'Finish',
            next: 'Next',
            skip: 'Skip tour'
          }}
        />
      )}
      {children}
    </>
  );
};

export default DashboardTour;