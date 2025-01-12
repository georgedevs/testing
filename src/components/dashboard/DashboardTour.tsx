import React, { ReactNode, useEffect, useState } from 'react';
import { TourProvider, useTour } from '@reactour/tour';
import type { StepType } from '@reactour/tour';

interface DashboardTourProps {
  children: ReactNode;
  isAvatarModalOpen?: boolean;
}

const steps: StepType[] = [
  {
    selector: '[data-tutorial="profile-completion"]',
    content: () => (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
          Complete Your Profile
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Start by completing your profile information. This helps us:
        </p>
        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            Match you with the right counselor
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            Personalize your counseling experience
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            Provide better support during sessions
          </li>
        </ul>
      </div>
    ),
  },
  {
    selector: '[data-tutorial="notifications"]',
    content: () => (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
          Stay Updated
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Your notification center keeps you informed about:
        </p>
        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            Upcoming session reminders
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            Messages from your counselor
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            Important updates about your care
          </li>
        </ul>
      </div>
    ),
  },
  {
    selector: '[data-tutorial="profile-menu"]',
    content: () => (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
          Profile & Settings
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Your personal menu provides quick access to:
        </p>
        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            Profile settings and preferences
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            Account management
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            Theme customization
          </li>
        </ul>
      </div>
    ),
  },
  {
    selector: '[data-tutorial="book-meeting"]',
    content: () => (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
          Schedule Your Sessions
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Easily book your counseling sessions:
        </p>
        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            Choose your preferred time slots
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            Select your counselor
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            Manage your appointments
          </li>
        </ul>
      </div>
    ),
  },
  {
    selector: '[data-tutorial="join-session"]',
    content: () => (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
          Join Your Sessions
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Connect with your counselor securely:
        </p>
        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            One-click session access
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            End-to-end encrypted video calls
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            Built-in session tools and resources
          </li>
        </ul>
      </div>
    ),
  },
  {
    selector: '[data-tutorial="meeting-history"]',
    content: () => (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
          Track Your Progress
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Review your counseling journey:
        </p>
        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            View past session summaries
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            Track your progress over time
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            Access session notes and resources
          </li>
        </ul>
      </div>
    ),
  },
  {
    selector: '[data-tutorial="feedback"]',
    content: () => (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
          Share Your Feedback
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Help us improve your experience:
        </p>
        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            Rate your sessions
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            Provide detailed feedback
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            Suggest improvements
          </li>
        </ul>
      </div>
    ),
  },
];

const CustomNavigationButtons: React.FC<{
  setCurrentStep: (step: number) => void;
  currentStep: number;
  stepsLength: number;
  onClose: () => void;
}> = ({ setCurrentStep, currentStep, stepsLength, onClose }) => {
  const isLastStep = currentStep === stepsLength - 1;
  
  return (
    <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
      <button
        onClick={() => setCurrentStep(currentStep - 1)}
        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
          currentStep === 0
            ? 'opacity-0 cursor-default'
            : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
        }`}
        disabled={currentStep === 0}
      >
        Previous
      </button>
      <button
        onClick={() => {
          if (isLastStep) {
            onClose();
          } else {
            setCurrentStep(currentStep + 1);
          }
        }}
        className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-200 shadow-lg shadow-blue-500/20"
      >
        {isLastStep ? 'Get Started' : 'Next'}
      </button>
    </div>
  );
};

const DashboardTour: React.FC<DashboardTourProps> = ({ children,isAvatarModalOpen  }) => {
    const [isTourOpen, setIsTourOpen] = useState(false);
    const [shouldStartTour, setShouldStartTour] = useState(false);
  
    useEffect(() => {
        // Check if this is the user's first visit
        const hasSeenTour = localStorage.getItem('hasSeenDashboardTour');
        
        if (!hasSeenTour) {
          setShouldStartTour(true);
        }
      }, []);
    
      // Add this new useEffect to handle tour start after avatar modal closes
      useEffect(() => {
        if (shouldStartTour && !isAvatarModalOpen) {
          // Small delay to ensure all elements are rendered after avatar modal closes
          const timer = setTimeout(() => {
            setIsTourOpen(true);
          }, 1000);
          
          return () => clearTimeout(timer);
        }
      }, [shouldStartTour, isAvatarModalOpen]);
    
      const handleTourClose = () => {
        setIsTourOpen(false);
        setShouldStartTour(false);
        localStorage.setItem('hasSeenDashboardTour', 'true');
      };

  return (
    <TourProvider
      steps={steps}
      isOpen={isTourOpen}
      onClose={handleTourClose}
      scrollSmooth={true}
      padding={{ mask: 16 }}
      styles={{
        popover: (base) => ({
          ...base,
          '--reactour-accent': '#2563eb',
          borderRadius: '1rem',
          padding: '1.5rem',
          maxWidth: '24rem',
        }),
        badge: (base) => ({
          ...base,
          backgroundColor: '#2563eb',
          padding: '0.25rem 0.75rem',
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
          fontWeight: 500,
        }),
        close: (base) => ({
          ...base,
          padding: '0.5rem',
          color: '#6b7280',
          ':hover': {
            color: '#111827',
          },
        }),
        mask: (base) => ({
          ...base,
          color: 'rgba(0, 0, 0, 0.75)',
        }),
      }}
      showNavigation={false}
      showBadge={false}
      showDots={false}
      ContentComponent={({ content }) => (
        <div className="focus:outline-none">
          {typeof content === 'function' ? content() : content}
        </div>
      )}
      componentsProps={{
        navigationButtons: {
          component: CustomNavigationButtons,
        },
      }}
    >
      {children}
    </TourProvider>
  );
};

export default DashboardTour;