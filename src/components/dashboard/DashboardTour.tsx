import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Loader2, Bell, UserCircle, FileText, Calendar, History, MessageSquare, Info, AlertCircle } from 'lucide-react';
import { useUpdateTourStatusMutation } from '@/redux/feautures/user/userApi';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';

// Dynamically importing Joyride to avoid SSR issues
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
  
  // Get theme info
  const { theme } = useTheme();
  const isDarkTheme = theme === 'dark';
  
  const user = useSelector((state: RootState) => state.auth.user);
  const [updateTourStatus] = useUpdateTourStatusMutation();

  // Only set tour ready when we have definitive user data
  useEffect(() => {
    if (!isLoadingUser && user) {
      setIsTourReady(true);
      if (!user.tourViewed && !isAvatarModalOpen && user.avatar) {
        // Small delay to ensure all elements are properly loaded
        const timer = setTimeout(() => {
          setRunTour(true);
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [isLoadingUser, user, isAvatarModalOpen]);

  const steps = [
    {
      target: '[data-tutorial="notifications"]',
      content: (
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <Bell className="w-5 h-5 text-blue-500 dark:text-orange-400" />
            <h3 className="text-lg font-semibold text-blue-600 dark:text-orange-400">Stay Informed</h3>
          </div>
          <p className="text-gray-700 dark:text-gray-100">
            Receive timely alerts about upcoming sessions, counselor assignments, and important updates.
          </p>
          <div className="text-xs text-gray-600 dark:text-gray-300 mt-2 flex items-start gap-2">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-500 dark:text-blue-400" />
            <span>Click the bell icon anytime to check your notifications</span>
          </div>
        </div>
      ),
      disableBeacon: true,
      placement: 'bottom',
    },
    {
      target: '[data-tutorial="profile-menu"]',
      content: (
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <UserCircle className="w-5 h-5 text-blue-500 dark:text-orange-400" />
            <h3 className="text-lg font-semibold text-blue-600 dark:text-orange-400">Your Profile</h3>
          </div>
          <p className="text-gray-700 dark:text-gray-100">
            Access your account settings, customize your profile, and manage your personal information.
          </p>
          <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/50 rounded text-sm text-blue-700 dark:text-blue-200">
            <span className="font-medium">Pro tip:</span> Regularly update your profile to help us better understand your needs
          </div>
        </div>
      ),
      placement: 'bottom',
    },
    {
      target: '[data-tutorial="profile-completion"]',
      content: (
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-5 h-5 text-blue-500 dark:text-orange-400" />
            <h3 className="text-lg font-semibold text-blue-600 dark:text-orange-400">Complete Your Profile</h3>
          </div>
          <p className="text-gray-700 dark:text-gray-100">
            The more we know about you, the better we can match you with the right counselor.
          </p>
          <ul className="list-disc pl-5 text-sm space-y-1 text-gray-600 dark:text-gray-300">
            <li>Add your relationship status</li>
            <li>Set your counselor preferences</li>
            <li>Share your specific concerns</li>
          </ul>
        </div>
      ),
      placement: 'right',
    },
    {
      target: '[data-tutorial="book-meeting"]',
      content: (
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-blue-500 dark:text-orange-400" />
            <h3 className="text-lg font-semibold text-blue-600 dark:text-orange-400">Schedule a Session</h3>
          </div>
          <p className="text-gray-700 dark:text-gray-100">
            Book a new counseling session at your convenience with just a few clicks.
          </p>
          <div className="flex items-center gap-2 mt-2 text-sm text-gray-700 dark:text-gray-200">
            <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-200 rounded-full text-xs font-medium">Virtual</span>
            <span>or</span>
            <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-200 rounded-full text-xs font-medium">In-person</span>
            <span>sessions available</span>
          </div>
        </div>
      ),
      placement: 'left',
    },
    {
      target: '[data-tutorial="join-session"]',
      content: (
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-blue-500 dark:text-orange-400" />
            <h3 className="text-lg font-semibold text-blue-600 dark:text-orange-400">Join Your Session</h3>
          </div>
          <p className="text-gray-700 dark:text-gray-100">
            Connect with your counselor through our secure, anonymous platform with a single click.
          </p>
          <div className="text-xs bg-yellow-50 dark:bg-yellow-900/50 p-2 rounded flex items-start gap-2 text-yellow-700 dark:text-yellow-200">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>You can join 5 minutes before your scheduled time</span>
          </div>
        </div>
      ),
      placement: 'top',
    },
    {
      target: '[data-tutorial="meeting-history"]',
      content: (
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <History className="w-5 h-5 text-blue-500 dark:text-orange-400" />
            <h3 className="text-lg font-semibold text-blue-600 dark:text-orange-400">Session History</h3>
          </div>
          <p className="text-gray-700 dark:text-gray-100">
            Review your past counseling sessions and track your journey to better relationships.
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300 p-2 bg-gray-50 dark:bg-gray-800/50 rounded mt-2">
            Your entire session history is kept private and secure.
          </p>
        </div>
      ),
      placement: 'right',
    },
    {
      target: '[data-tutorial="feedback"]',
      content: (
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-5 h-5 text-blue-500 dark:text-orange-400" />
            <h3 className="text-lg font-semibold text-blue-600 dark:text-orange-400">Share Your Feedback</h3>
          </div>
          <p className="text-gray-700 dark:text-gray-100">
            Your opinions help us improve! Rate your sessions and provide valuable feedback to counselors.
          </p>
          <div className="flex items-center gap-1 text-yellow-500 mt-1 justify-center">
            <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
          </div>
          <p className="text-xs text-center text-gray-600 dark:text-gray-300">
            Your feedback helps counselors improve their approach
          </p>
        </div>
      ),
      placement: 'left',
    }
  ];

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
      <AnimatePresence>
        {isUpdating && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl flex flex-col items-center gap-4"
            >
              <Loader2 className="animate-spin text-blue-500 dark:text-orange-400 w-8 h-8" />
              <p className="text-gray-700 dark:text-gray-200 font-medium">Saving your progress...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {isTourReady && !user?.tourViewed && (
        <Joyride
          steps={steps}
          run={runTour}
          continuous
          scrollToFirstStep={false}
          showProgress
          showSkipButton
          spotlightClicks={false}
          disableOverlayClose
          hideCloseButton
          callback={handleTourCallback}
          styles={{
            options: {
              primaryColor: isDarkTheme ? '#f97316' : '#2563eb', // Orange in dark mode, blue in light mode
              zIndex: 9999,
              arrowColor: isDarkTheme ? '#1f2937' : '#fff',
              backgroundColor: isDarkTheme ? '#1f2937' : '#fff',
              overlayColor: 'rgba(0, 0, 0, 0.75)',
              textColor: isDarkTheme ? '#f3f4f6' : '#1f2937',
            },
            spotlight: {
              backgroundColor: 'transparent',
            },
            tooltip: {
              borderRadius: '8px',
              fontSize: '14px',
              boxShadow: isDarkTheme 
                ? '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)'
                : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            },
            buttonNext: {
              backgroundColor: isDarkTheme ? '#f97316' : '#2563eb',
              color: '#ffffff',
              borderRadius: '6px',
              fontSize: '14px',
              padding: '8px 16px',
            },
            buttonBack: {
              marginRight: 10,
              fontSize: '14px',
            },
            tooltipContainer: {
              textAlign: 'left',
            },
            tooltipContent: {
              padding: '8px 0',
            },
            tooltipFooter: {
              marginTop: '8px',
            },
          }}
          locale={{
            back: 'Previous',
            close: 'Close',
            last: 'Finish Tour',
            next: 'Continue',
            skip: 'Skip Tour'
          }}
        />
      )}
      {children}
    </>
  );
};

export default DashboardTour;