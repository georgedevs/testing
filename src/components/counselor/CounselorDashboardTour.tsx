import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Loader2 } from 'lucide-react';
import { useUpdateTourStatusMutation } from '@/redux/feautures/user/userApi';
import { Styles } from 'react-joyride';

// Dynamically import Joyride to avoid SSR issues
const Joyride = dynamic(
  () => import('react-joyride').then((mod) => mod.default),
  { ssr: false }
);

// Interfaces
interface TourStep {
  target: string;
  content: string;
  disableBeacon?: boolean;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  title?: string;
}

interface CounselorDashboardTourProps {
  children: React.ReactNode;
  isAvatarModalOpen: boolean;
}

const CounselorDashboardTour: React.FC<CounselorDashboardTourProps> = ({ 
  children, 
  isAvatarModalOpen 
}) => {
  // State management
  const [runTour, setRunTour] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Redux hooks
  const user = useSelector((state: RootState) => state.auth.user);
  const [updateTourStatus] = useUpdateTourStatusMutation();

  // Tour steps configuration
  const steps: TourStep[] = [
    {
      target: '[data-tutorial="counselor-notifications"]',
      content: 'Get notified about new meeting requests and upcoming sessions',
      disableBeacon: true,
    },
    {
      target: '[data-tutorial="counselor-profile"]',
      content: 'Manage your counselor profile and settings',
    },
    {
      target: '[data-tutorial="upcoming-sessions"]',
      content: 'View and manage your scheduled counseling sessions for the next 7 days',
    },
    {
      target: '[data-tutorial="meeting-requests"]',
      content: 'Review and respond to new client meeting requests',
    },
    {
      target: '[data-tutorial="session-history"]',
      content: 'Access your past session records and client history',
    },
    {
      target: '[data-tutorial="client-feedback"]',
      content: 'View feedback and ratings from your clients',
    },
    {
      target: '[data-tutorial="counselor-availability"]',
      content: 'Set your working hours and manage your availability',
    }
  ];

  // Joyride styles
  const tourStyles: Styles = {
    options: {
      primaryColor: '#2563eb',
      zIndex: 9999,
      arrowColor: '#fff',
      backgroundColor: '#fff',
      overlayColor: 'rgba(0, 0, 0, 0.75)',
      textColor: '#1f2937'
    },
    tooltipContainer: {
      textAlign: 'left' as const, 
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

  // Effects
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !user?.tourViewed && !isAvatarModalOpen && user?.avatar) {
      setRunTour(true);
    }
  }, [isAvatarModalOpen, user, mounted]);

  // Handlers
  const handleTourCallback = async (data: any) => {
    const { status, type } = data;
  
    // Check if tour is finished or skipped
    if ((type === 'tour:end' && status === 'finished') || status === 'skipped') {
      setIsLoading(true);
      try {
        const result = await updateTourStatus().unwrap();
        if (result.success) {
          setRunTour(false);
        }
      } catch (error) {
        console.error('Failed to update tour status:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (!mounted) return <>{children}</>;

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <Loader2 className="animate-spin text-white w-8 h-8" />
        </div>
      )}
      
      {mounted && !user?.tourViewed && (
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

export default CounselorDashboardTour;