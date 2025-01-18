import React from 'react';
import Link from 'next/link';
import { Calendar, Video, History, MessageSquare, ChevronRight, User } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import ProfileCompletionCard from '@/components/dashboard/ProfileCompletionCard';
import { RootState } from '@/redux/store';

interface DashboardContentProps {
  user: RootState['auth']['user'];
}

const DashboardContent: React.FC<DashboardContentProps> = ({ user }) => {
  const quickActions = [
    {
      title: "Book Meeting",
      description: "Schedule a new counseling session with a counselor",
      icon: <Calendar className="w-6 h-6 text-blue-500" />,
      href: "/dashboard/book",
      stats: "Available slots",
      color: "from-blue-600 to-blue-400",
      dataTutorial: "book-meeting"
    },
    {
      title: "Join Session",
      description: "Join your scheduled counseling session",
      icon: <Video className="w-6 h-6 text-purple-500" />,
      href: "/dashboard/session",
      stats: "Upcoming sessions",
      color: "from-purple-600 to-purple-400",
      dataTutorial: "join-session"
    },
    {
      title: "Meeting History",
      description: "View your past counseling sessions",
      icon: <History className="w-6 h-6 text-emerald-500" />,
      href: "/dashboard/history",
      stats: "Past sessions",
      color: "from-emerald-600 to-emerald-400",
      dataTutorial: "meeting-history"
    },
    {
      title: "Feedback",
      description: "Provide feedback for your counseling sessions",
      icon: <MessageSquare className="w-6 h-6 text-rose-500" />,
      href: "/dashboard/feedback",
      stats: "Session feedback",
      color: "from-rose-600 to-rose-400",
      dataTutorial: "feedback"
    }
  ];

  const calculateProfileCompletion = (user: any): number => {
    if (!user) return 0;
    
    const fields = [
      'username',
      'age',
      'marriageYears',
    ];
    
    const completedFields = fields.filter(field => {
      const value = user[field];
      return value !== undefined && value !== null && value !== '';
    });
    
    return Math.round((completedFields.length / fields.length) * 100);
  };

  const completionPercentage = calculateProfileCompletion(user);

  return (
    <div className="grid gap-6">
      {completionPercentage < 100 ? (
        <div data-tutorial="profile-completion">
          <ProfileCompletionCard user={user} />
        </div>
      ) : (
        <Link href="/dashboard/profile" data-tutorial="profile-settings">
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
                Update your profile information and preferences
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