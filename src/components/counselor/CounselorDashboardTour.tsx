import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Loader2, CheckCircle, Info, AlertCircle, Star, Calendar, Users, MessageSquare, Clock, Bell } from 'lucide-react';
import { useUpdateTourStatusMutation } from '@/redux/feautures/user/userApi';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';

// Dynamically import Joyride to avoid SSR issues
const Joyride = dynamic(
  () => import('react-joyride').then((mod) => mod.default),
  { ssr: false }
);

interface CounselorDashboardTourProps {
  children: React.ReactNode;
  isAvatarModalOpen: boolean;
  isLoadingUser?: boolean;
}

const CounselorDashboardTour: React.FC<CounselorDashboardTourProps> = ({ 
  children, 
  isAvatarModalOpen,
  isLoadingUser = false
}) => {
  // State management
  const [runTour, setRunTour] = useState(false);
  const [isTourReady, setIsTourReady] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Get theme info
  const { theme } = useTheme();
  const isDarkTheme = theme === 'dark';
  
  // Redux hooks
  const user = useSelector((state: RootState) => state.auth.user);
  const [updateTourStatus] = useUpdateTourStatusMutation();

  // Only set tour ready when we have definitive user data
  useEffect(() => {
    if (!isLoadingUser && user) {
      setIsTourReady(true);
      if (!user.tourViewed && !isAvatarModalOpen && user.avatar) {
        // Small delay to ensure DOM elements are fully loaded
        const timer = setTimeout(() => {
          setRunTour(true);
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [isLoadingUser, user, isAvatarModalOpen]);

  // Tour steps configuration with dark mode compatibility
  const steps = [
    {
      target: '[data-tutorial="counselor-notifications"]',
      content: (
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <Bell className="w-5 h-5 text-blue-500 dark:text-orange-400" />
            <h3 className="text-lg font-semibold text-blue-600 dark:text-orange-400">
              Notifications Center
            </h3>
          </div>
          <p className="text-gray-700 dark:text-gray-100">
            Stay informed about client requests, upcoming sessions, and important updates.
          </p>
          <div className="p-2 bg-blue-50 dark:bg-blue-900/50 rounded text-sm text-blue-700 dark:text-blue-200 flex items-start gap-2">
            <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>A red indicator appears when you have unread notifications</span>
          </div>
        </div>
      ),
      disableBeacon: true,
      placement: 'bottom',
    },
    {
      target: '[data-tutorial="counselor-profile"]',
      content: (
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-blue-500 dark:text-orange-400" />
            <h3 className="text-lg font-semibold text-blue-600 dark:text-orange-400">
              Your Profile
            </h3>
          </div>
          <p className="text-gray-700 dark:text-gray-100">
            Access your account settings, manage your availability, and update your professional information.
          </p>
          <ul className="list-disc pl-5 text-sm space-y-1 text-gray-600 dark:text-gray-300">
            <li>Edit your specializations</li>
            <li>Set your working hours</li>
            <li>Update your credentials</li>
          </ul>
        </div>
      ),
      placement: 'bottom',
    },
    {
      target: '[data-tutorial="upcoming-sessions"]',
      content: (
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-blue-500 dark:text-orange-400" />
            <h3 className="text-lg font-semibold text-blue-600 dark:text-orange-400">
              Upcoming Sessions
            </h3>
          </div>
          <p className="text-gray-700 dark:text-gray-100">
            View and manage your scheduled counseling sessions for the next 7 days.
          </p>
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              <span className="text-sm text-gray-600 dark:text-gray-300">Today's sessions</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span>
              <span className="text-sm text-gray-600 dark:text-gray-300">Tomorrow's sessions</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-purple-500"></span>
              <span className="text-sm text-gray-600 dark:text-gray-300">Future sessions</span>
            </div>
          </div>
        </div>
      ),
      placement: 'right',
    },
    {
      target: '[data-tutorial="meeting-requests"]',
      content: (
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-5 h-5 text-blue-500 dark:text-orange-400" />
            <h3 className="text-lg font-semibold text-blue-600 dark:text-orange-400">
              Meeting Requests
            </h3>
          </div>
          <p className="text-gray-700 dark:text-gray-100">
            Review and respond to new client meeting requests assigned to you.
          </p>
          <div className="p-2 bg-green-50 dark:bg-green-900/50 rounded-md flex items-start gap-2 text-sm text-green-700 dark:text-green-200">
            <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>Faster response times lead to higher client satisfaction ratings</span>
          </div>
        </div>
      ),
      placement: 'left',
    },
    {
      target: '[data-tutorial="session-history"]',
      content: (
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-blue-500 dark:text-orange-400" />
            <h3 className="text-lg font-semibold text-blue-600 dark:text-orange-400">
              Session History
            </h3>
          </div>
          <p className="text-gray-700 dark:text-gray-100">
            Access your past sessions, client notes, and track your counseling journey.
          </p>
          <div className="grid grid-cols-2 gap-2 mt-1">
            <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded">
              <div className="text-lg font-semibold text-center text-gray-800 dark:text-gray-100">
                {user?.completedSessions || "0"}
              </div>
              <div className="text-xs text-center text-gray-500 dark:text-gray-400">
                Completed Sessions
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded">
              <div className="text-lg font-semibold text-center text-gray-800 dark:text-gray-100">
                {user?.activeClients || "0"}
              </div>
              <div className="text-xs text-center text-gray-500 dark:text-gray-400">
                Active Clients
              </div>
            </div>
          </div>
        </div>
      ),
      placement: 'right',
    },
    {
      target: '[data-tutorial="client-feedback"]',
      content: (
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <h3 className="text-lg font-semibold text-blue-600 dark:text-orange-400">
              Client Feedback
            </h3>
          </div>
          <p className="text-gray-700 dark:text-gray-100">
            View feedback and ratings from your clients to improve your counseling approach.
          </p>
          <div className="flex items-center justify-center gap-1 text-yellow-500 mt-1">
            <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
            <span className="text-sm ml-2 text-gray-600 dark:text-gray-300">
              ({user?.totalRatings || 0} ratings)
            </span>
          </div>
        </div>
      ),
      placement: 'bottom',
    },
    {
      target: '[data-tutorial="counselor-availability"]',
      content: (
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-blue-500 dark:text-orange-400" />
            <h3 className="text-lg font-semibold text-blue-600 dark:text-orange-400">
              Availability Management
            </h3>
          </div>
          <p className="text-gray-700 dark:text-gray-100">
            Set your working hours, blocked dates, and manage your availability for clients.
          </p>
          <div className="mt-2 grid grid-cols-7 gap-1">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
              <div 
                key={i} 
                className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-medium
                  ${i === 0 || i === 6 
                    ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-200' 
                    : 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-200'}`
                }
              >
                {day}
              </div>
            ))}
          </div>
          <div className="p-2 bg-yellow-50 dark:bg-yellow-900/50 rounded text-sm text-yellow-700 dark:text-yellow-200 flex items-start gap-2 mt-2">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>Remember to update your calendar regularly to avoid scheduling conflicts</span>
          </div>
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
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-2xl flex flex-col items-center gap-5 max-w-sm"
            >
              <div className="relative">
                <Loader2 className="animate-spin text-blue-500 dark:text-orange-400 w-10 h-10" />
                <div className="absolute inset-0 animate-pulse opacity-50 blur-xl bg-blue-300 dark:bg-orange-400 rounded-full" />
              </div>
              <p className="text-gray-700 dark:text-gray-200 font-medium text-center">
                Saving your preferences...
              </p>
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
              color: isDarkTheme ? '#d1d5db' : '#4b5563',
            },
            buttonSkip: {
              color: isDarkTheme ? '#d1d5db' : '#6b7280',
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

export default CounselorDashboardTour;