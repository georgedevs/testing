import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

// Dynamically import Joyride with no SSR
const Joyride = dynamic(
  () => import('react-joyride').then((mod) => mod.default),
  { ssr: false }
);

interface TourStep {
  target: string;
  content: string;
  disableBeacon?: boolean;
}

interface DashboardTourProps {
  children: React.ReactNode;
  isAvatarModalOpen: boolean;
}

const DashboardTour: React.FC<DashboardTourProps> = ({ children, isAvatarModalOpen }) => {
  const [runTour, setRunTour] = useState(false);
  const [mounted, setMounted] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Check if this is user's first time and avatar modal is closed
    if (mounted) {
      const hasSeenTour = localStorage.getItem('hasSeenDashboardTour');
      if (!hasSeenTour && !isAvatarModalOpen && user?.avatar) {
        setRunTour(true);
      }
    }
  }, [isAvatarModalOpen, user, mounted]);

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

  const handleTourCallback = (data: any) => {
    const { status } = data;
    const finishedStatuses = ['FINISHED', 'SKIPPED'];

    if (finishedStatuses.includes(status)) {
      setRunTour(false);
      localStorage.setItem('hasSeenDashboardTour', 'true');
    }
  };

  if (!mounted) return <>{children}</>;

  return (
    <>
      {mounted && (
        <Joyride
          steps={steps}
          run={runTour}
          continuous
          showProgress
          showSkipButton
          callback={handleTourCallback}
          styles={{
            options: {
              primaryColor: '#2563eb',
              zIndex: 1000,
            },
            tooltipContainer: {
              textAlign: 'left',
            },
            buttonNext: {
              backgroundColor: '#2563eb',
            },
            buttonBack: {
              marginRight: 10,
            },
          }}
        />
      )}
      {children}
    </>
  );
};

export default DashboardTour;