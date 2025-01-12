import React from 'react';
import { ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface User {
  username?: string;
  age?: number | string;
  marriageYears?: number | string;
  preferredCounselorGender?: string;
  timezone?: string;
  emergencyContact?: {
    name?: string;
    relationship?: string;
    phone?: string;
  };
}

interface ProfileCompletionCardProps {
  user: User | null;
}

const calculateProfileCompletion = (user: User | null): number => {
  if (!user) return 0;
  
  const fields = [
    'username',
    'age',
    'marriageYears',
    'preferredCounselorGender',
  ];
  
  const completedFields = fields.filter(field => {
    const value = user[field as keyof User];
    return value !== undefined && value !== null && value !== '';
  });
  
  return Math.round((completedFields.length / fields.length) * 100);
};

const getIncompleteFields = (user: User | null): string[] => {
  if (!user) return [];
  
  const requiredFields = {
    username: 'Username',
    age: 'Age',
    marriageYears: 'Years of Marriage',
    preferredCounselorGender: 'Preferred Counselor Gender'
  };
  
  return Object.entries(requiredFields)
    .filter(([key]) => {
      const value = user[key as keyof User];
      return value === undefined || value === null || value === '';
    })
    .map(([_, label]) => label);
};

const ProfileCompletionCard: React.FC<ProfileCompletionCardProps> = ({ user }) => {
  const completionPercentage = calculateProfileCompletion(user);
  const incompleteFields = getIncompleteFields(user);
  
  return (
    <Card 
      className="border border-gray-200/50 dark:border-gray-700/50 shadow-lg shadow-gray-900/10"
      data-tutorial="profile-completion-card"
    >
      <CardContent className="p-5">
        {completionPercentage < 100 ? (
          <Alert 
            className="mb-4 bg-red-50/50 dark:bg-red-900/10 border-red-200/50 dark:border-red-800/50"
            data-tutorial="profile-alert"
          >
            <AlertCircle className="h-4 w-4 text-red-500 dark:text-red-400" />
            <AlertDescription className="text-red-500 dark:text-red-400 text-sm ml-2">
              Please complete your profile to enhance your counseling experience
            </AlertDescription>
          </Alert>
        ) : (
          <Alert 
            className="mb-4 bg-green-50/50 dark:bg-green-900/10 border-green-200/50 dark:border-green-800/50"
            data-tutorial="profile-complete"
          >
            <CheckCircle2 className="h-4 w-4 text-green-500 dark:text-green-400" />
            <AlertDescription className="text-green-500 dark:text-green-400 text-sm ml-2">
              Your profile is complete and ready for counseling sessions
            </AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-4">
          <div 
            className="flex items-center justify-between"
            data-tutorial="profile-progress"
          >
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Profile Completion
            </span>
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              {completionPercentage}%
            </span>
          </div>
          
          <Progress 
            value={completionPercentage} 
            className="h-2 bg-gray-100 dark:bg-gray-800"
          />
          
          {incompleteFields.length > 0 && (
            <div 
              className="mt-4 space-y-2"
              data-tutorial="incomplete-fields"
            >
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Missing information:
              </p>
              <ul className="list-disc list-inside space-y-1">
                {incompleteFields.map((field) => (
                  <li 
                    key={field}
                    className="text-sm text-gray-500 dark:text-gray-400"
                  >
                    {field}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {completionPercentage < 100 && (
            <div 
              className="flex justify-end pt-2"
              data-tutorial="complete-profile-link"
            >
              <Link 
                href="/dashboard/profile"
                className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              >
                Complete your profile <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCompletionCard;