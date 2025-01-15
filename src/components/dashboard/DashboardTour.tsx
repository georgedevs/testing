import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Loader } from 'lucide-react';
import { useUpdateTourStatusMutation } from '@/redux/feautures/user/userApi';

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

interface DashboardTourProps {
  children: React.ReactNode;
  isAvatarModalOpen: boolean;
}

interface JoyrideStyles {
  options: {
    primaryColor: string;
    zIndex: number;
    arrowColor: string;
    backgroundColor: string;
    overlayColor: string;
    textColor: string;
  };
  tooltipContainer: {
    textAlign: 'left' | 'center' | 'right';
  };
  buttonNext: {
    backgroundColor: string;
  };
  buttonBack: {
    marginRight: number;
  };
  spotlight: {
    backgroundColor: string;
  };
}

interface JoyrideCallbackData {
  action: string;
  index: number;
  type: string;
  status: string;
}

const DashboardTour: React.FC<DashboardTourProps> = ({ children, isAvatarModalOpen }) => {
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
  // Joyride styles
  const tourStyles: JoyrideStyles = {
    options: {
      primaryColor: '#2563eb',
      zIndex: 9999,
      arrowColor: '#fff',
      backgroundColor: '#fff',
      overlayColor: 'rgba(0, 0, 0, 0.75)',
      textColor: '#1f2937'
    },
    tooltipContainer: {
      textAlign: 'left'
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

  console.log(user?.tourViewed);
  
  // Handlers
  const handleTourCallback = async (data: JoyrideCallbackData) => {
    const { status } = data;
    const finishedStatuses = ['FINISHED', 'SKIPPED'];

    if (finishedStatuses.includes(status)) {
      setIsLoading(true);
      try {
        await updateTourStatus().unwrap();
        setRunTour(false);
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
          <Loader className="animate-spin text-white" size={48} />
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

export default DashboardTour;