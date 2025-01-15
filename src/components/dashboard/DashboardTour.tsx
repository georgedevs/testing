import React, { useState, useEffect } from 'react';
import Joyride, { STATUS, CallBackProps } from 'react-joyride';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

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
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    // Check if this is user's first time and avatar modal is closed
    const hasSeenTour = localStorage.getItem('hasSeenDashboardTour');
    if (!hasSeenTour && !isAvatarModalOpen && user?.avatar) {
      setRunTour(true);
    }
  }, [isAvatarModalOpen, user]);

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

  const handleTourCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRunTour(false);
      localStorage.setItem('hasSeenDashboardTour', 'true');
    }
  };

  return (
    <>
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
      {children}
    </>
  );
};

export default DashboardTour;