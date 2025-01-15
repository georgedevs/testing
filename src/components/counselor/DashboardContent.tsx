import React from 'react';
import Link from 'next/link';
import { Clock, Calendar, MessageSquare, History, ChevronRight, User } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import CounselorProfileCompletionCard from '@/components/counselor/CounselorProfileCompletionCard';
import { RootState } from '@/redux/store';

interface DashboardContentProps {
  user: RootState['auth']['user'];
}

const DashboardContent: React.FC<DashboardContentProps> = ({ user }) => {
  const quickActions = [
    {
      title: "Upcoming Sessions",
      description: "View and manage your scheduled counseling sessions",
      icon: <Clock className="w-6 h-6 text-blue-500" />,
      href: "/counselor/upcoming",
      stats: "Next 7 days",
      color: "from-blue-600 to-blue-400",
      dataTutorial: "upcoming-sessions"
    },
    {
      title: "Meeting Requests",
      description: "Review and respond to new client meeting requests",
      icon: <Calendar className="w-6 h-6 text-purple-500" />,
      href: "/counselor/requests",
      stats: "Pending requests",
      color: "from-purple-600 to-purple-400",
      dataTutorial: "meeting-requests"
    },
    {
      title: "Session History",
      description: "Access records of past counseling sessions",
      icon: <History className="w-6 h-6 text-emerald-500" />,
      href: "/counselor/history",
      stats: "Past sessions",
      color: "from-emerald-600 to-emerald-400",
      dataTutorial: "session-history"
    },
    {
      title: "Client Feedback",
      description: "View feedback and ratings from your clients",
      icon: <MessageSquare className="w-6 h-6 text-rose-500" />,
      href: "/counselor/feedback",
      stats: "Recent feedback",
      color: "from-rose-600 to-rose-400",
      dataTutorial: "client-feedback"
    }
  ];

  const calculateProfileCompletion = (user: any): number => {
    if (!user) return 0;
    
    const requiredFields = [
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

  const completionPercentage = calculateProfileCompletion(user);

  return (
    <div className="grid gap-6">
      {completionPercentage < 100 ? (
        <CounselorProfileCompletionCard user={user} />
      ) : (
        <Link href="/counselor/profile">
          <Card className="transition-all duration-200 hover:shadow-lg hover:border-blue-500/50 group cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold">
                <User className="w-6 h-6 text-blue-500" />
              </CardTitle>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
            </CardHeader>
            <CardContent>
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                Manage Your Profile
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Update your counselor profile, availability, and preferences
              </p>
            </CardContent>
          </Card>
        </Link>
      )}
      
      <div className="grid md:grid-cols-2 gap-6">
      {quickActions.map((action) => (
  <Link 
    href={action.href} 
    key={action.title}
    data-tutorial={action.dataTutorial}
  >
    <Card className="h-full transition-all duration-200 hover:shadow-lg hover:border-blue-500/50 group">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">
          {action.icon}
        </CardTitle>
        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
      </CardHeader>
      <CardContent>
        <h3 className={`text-xl font-bold bg-gradient-to-r ${action.color} bg-clip-text text-transparent`}>
          {action.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
          {action.description}
        </p>
        <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
          <span className="font-medium">{action.stats}</span>
        </div>
      </CardContent>
    </Card>
  </Link>
        ))}
      </div>

    </div>
  );
};

export default DashboardContent;