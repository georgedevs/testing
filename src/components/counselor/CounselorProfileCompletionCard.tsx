import React from 'react';
import { ArrowRight, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CounselorUser {
  fullName?: string;
  specializations?: string[];
  marriageYears?: number | string;
  gender?: string;
  languages?: string[];
  maxDailyMeetings?: number;
  workingHours?: {
    start?: string;
    end?: string;
    timezone?: string;
  };
  meetingPreferences?: {
    maxConsecutiveMeetings?: number;
  };
}

interface CounselorProfileCompletionCardProps {
  user: CounselorUser | null;
}

type FieldConfig = {
  field: keyof CounselorUser;
  subFields?: string[];
};

const calculateProfileCompletion = (user: CounselorUser | null): number => {
  if (!user) return 0;
  
  const requiredFields: FieldConfig[] = [
    { field: 'fullName' },
    { field: 'gender' },
    { field: 'marriageYears' },
    { field: 'maxDailyMeetings' },
    { 
      field: 'workingHours',
      subFields: ['start', 'end', 'timezone']
    },
    {
      field: 'meetingPreferences',
      subFields: ['maxConsecutiveMeetings']
    }
  ];
  
  let totalFields = 0;
  let completedFields = 0;

  requiredFields.forEach(config => {
    if (config.subFields) {
      const parentValue = user[config.field];
      
      if (typeof parentValue === 'object' && parentValue !== null) {
        config.subFields.forEach(subField => {
          totalFields++;
          const subValue = (parentValue as Record<string, unknown>)[subField];
          if (subValue !== undefined && subValue !== null && subValue !== '') {
            completedFields++;
          }
        });
      } else {
        // Add to total fields even if parent object is missing
        totalFields += config.subFields.length;
      }
    } else {
      totalFields++;
      const value = user[config.field];
      if (value !== undefined && value !== null && value !== '') {
        completedFields++;
      }
    }
  });
  
  return Math.round((completedFields / totalFields) * 100);
};

const CounselorProfileCompletionCard: React.FC<CounselorProfileCompletionCardProps> = ({ user }) => {
  const completionPercentage = calculateProfileCompletion(user);
  
  return (
    <Card className="border border-gray-200/50 dark:border-gray-700/50 shadow-lg shadow-gray-900/10">
      <CardContent className="p-5">
        {completionPercentage < 100 ? (
          <Alert className="mb-4 bg-red-50/50 dark:bg-red-900/10 border-red-200/50 dark:border-red-800/50">
            <AlertCircle className="h-4 w-4 text-red-500 dark:text-red-400" />
            <AlertDescription className="text-red-500 dark:text-red-400 text-sm ml-2">
              Complete your counselor profile to start accepting client sessions
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="mb-4 bg-green-50/50 dark:bg-green-900/10 border-green-200/50 dark:border-green-800/50">
            <AlertCircle className="h-4 w-4 text-green-500 dark:text-green-400" />
            <AlertDescription className="text-green-500 dark:text-green-400 text-sm ml-2">
              Your counselor profile is complete and ready to accept sessions
            </AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
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
          
          {completionPercentage < 100 && (
            <div className="flex justify-end pt-2">
              <Link 
                href="/counselor/profile"
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

export default CounselorProfileCompletionCard;