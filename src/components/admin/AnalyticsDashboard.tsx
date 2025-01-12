import React from 'react';
import { LineChart, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Line, Legend, Bar, ResponsiveContainer } from 'recharts';
import { 
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Activity,
  Star,
  Loader2
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useGetDashboardAnalyticsQuery } from '@/redux/feautures/admin/adminDashboardApi';

export default function AnalyticsDashboard() {
  const { data, isLoading, error } = useGetDashboardAnalyticsQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load analytics data
        </AlertDescription>
      </Alert>
    );
  }

  const { analytics } = data;

  // Prepare data for charts
  const meetingTypeData = [
    { name: 'Virtual', value: analytics.distribution.virtualMeetings },
    { name: 'Physical', value: analytics.distribution.physicalMeetings },
  ];

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Meetings</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.totalMeetings}</div>
            <p className="text-xs text-gray-500">All-time sessions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.completionRate}</div>
            <p className="text-xs text-gray-500">Successfully completed sessions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Monthly Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.growth.monthlyGrowth}</div>
            <p className="text-xs text-gray-500">Compared to last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Current Month</CardTitle>
            <Activity className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.growth.currentMonthMeetings}</div>
            <p className="text-xs text-gray-500">Sessions this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Session Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Meeting Types Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Meeting Type Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={meetingTypeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#3b82f6" name="Sessions" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Counselor Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Counselors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.counselorMetrics.slice(0, 5).map((counselor: any) => (
                <div key={counselor._id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="font-medium">{counselor.fullName}</div>
                    <div className="flex items-center text-yellow-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="ml-1 text-sm">
                        {counselor.averageRating ? counselor.averageRating.toFixed(1) : 'N/A'}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {counselor.totalSessions} sessions
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Session Status Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Session Status Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Completed</p>
                <p className="text-2xl font-bold">{analytics.overview.completedMeetings}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="p-2 bg-red-100 rounded-full">
                <XCircle className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Cancelled</p>
                <p className="text-2xl font-bold">{analytics.overview.cancelledMeetings}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="p-2 bg-orange-100 rounded-full">
                <AlertCircle className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium">No Shows</p>
                <p className="text-2xl font-bold">{analytics.overview.noShowMeetings}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}