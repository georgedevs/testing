import React from 'react';
import Link from 'next/link';
import { 
  Users, 
  Calendar, 
  History, 
  BarChart2, 
  MessageSquare,
  Video,
  ChevronRight
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface AdminDashboardContentProps {
  user: any; //replace this later with actual user type, so lazy right now
}

const AdminDashboardContent: React.FC<AdminDashboardContentProps> = ({ user }) => {
  const quickActions = [
    {
      title: "Counselors",
      description: "Manage counselor accounts and applications",
      icon: <Users className="w-6 h-6 text-blue-500" />,
      href: "/admin/counselors",
      stats: "Active counselors",
      color: "from-blue-600 to-blue-400"
    },
    {
      title: "Meeting Requests",
      description: "Monitor and oversee client-counselor meeting requests",
      icon: <Calendar className="w-6 h-6 text-purple-500" />,
      href: "/admin/requests",
      stats: "Pending requests",
      color: "from-purple-600 to-purple-400"
    },
    {
      title: "Meeting History",
      description: "View completed counseling session records",
      icon: <History className="w-6 h-6 text-emerald-500" />,
      href: "/admin/meetings",
      stats: "Total meetings",
      color: "from-emerald-600 to-emerald-400"
    },
    {
      title: "Session History",
      description: "Access detailed session recordings and notes",
      icon: <Video className="w-6 h-6 text-amber-500" />,
      href: "/admin/sessions",
      stats: "Recorded sessions",
      color: "from-amber-600 to-amber-400"
    },
    {
      title: "Analytics",
      description: "View platform statistics and performance metrics",
      icon: <BarChart2 className="w-6 h-6 text-indigo-500" />,
      href: "/admin/analytics",
      stats: "Platform metrics",
      color: "from-indigo-600 to-indigo-400"
    },
    {
      title: "Feedback",
      description: "Review client feedback and counselor ratings",
      icon: <MessageSquare className="w-6 h-6 text-rose-500" />,
      href: "/admin/feedback",
      stats: "Recent feedback",
      color: "from-rose-600 to-rose-400"
    }
  ];

  return (
    <div className="grid gap-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quickActions.map((action) => (
          <Link href={action.href} key={action.title}>
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

export default AdminDashboardContent;