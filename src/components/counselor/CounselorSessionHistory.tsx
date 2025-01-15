import React from 'react';
import { format } from 'date-fns';
import { Loader2, Calendar, Clock, Video, MapPin, Users, Star, CheckCircle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { 
  useGetCounselorSessionHistoryQuery, 
  useGetCounselorStatisticsQuery,
  type CounselorHistoryItem,
  type CounselorStatistics 
} from '@/redux/feautures/booking/bookingApi';

interface ExtendedCounselorStatistics extends CounselorStatistics {
  totalRatings?: number;
}

const CounselorSessionHistory = () => {
  const router = useRouter();
  const { data: historyData, isLoading: historyLoading } = useGetCounselorSessionHistoryQuery();
  const { data: statsData, isLoading: statsLoading } = useGetCounselorStatisticsQuery();

  const getStatusColor = (status: CounselorHistoryItem['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'cancelled':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'abandoned':
        return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getSessionTypeIcon = (type: CounselorHistoryItem['type']) => {
    return type === 'virtual' ? (
      <Video className="w-4 h-4" />
    ) : (
      <MapPin className="w-4 h-4" />
    );
  };

  if (historyLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  // If there's no history data or the history array is empty
  if (!historyData?.history || historyData.history.length === 0) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>No Session History</CardTitle>
          <CardDescription>
            You haven't conducted any counseling sessions yet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => router.push('/counselor/requests')}>
            View Session Requests
          </Button>
        </CardContent>
      </Card>
    );
  }

  const completedSessions = historyData.history.filter(session => session.status === 'completed').length;
  const totalSessions = historyData.history.length;
  const statistics = statsData?.statistics as ExtendedCounselorStatistics;

  return (
    <div className="container mx-auto space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Total Sessions</p>
                <p className="text-2xl font-bold">{totalSessions}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <p className="text-2xl font-bold">{completedSessions}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Active Clients</p>
                <p className="text-2xl font-bold">{statistics?.activeClients || 0}</p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Average Rating</p>
                <div className="flex items-center gap-1">
                  <p className="text-2xl font-bold">
                    {typeof statistics?.averageRating === 'number' 
                      ? statistics.averageRating.toFixed(1) 
                      : 'N/A'}
                  </p>
                  {statistics?.totalRatings && statistics.totalRatings > 0 && (
                    <span className="text-sm text-gray-500">
                      ({statistics.totalRatings} ratings)
                    </span>
                  )}
                  <Star className="w-5 h-5 text-yellow-500" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Session History */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Session History</CardTitle>
          <CardDescription>
            View your past counseling sessions and their details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-4">
              {historyData.history.map((session) => (
                <Card key={session.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={session.clientAvatar} alt={session.clientUsername} />
                      <AvatarFallback>{session.clientUsername[0]}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg">Client: {session.clientUsername}</h3>
                        <Badge 
                          variant="outline" 
                          className={`${getStatusColor(session.status)} capitalize`}
                        >
                          {session.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{session.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{session.time}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          {getSessionTypeIcon(session.type)}
                          <span className="capitalize">{session.type} Session</span>
                        </div>
                        {session.clientAge && (
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>Age: {session.clientAge}</span>
                          </div>
                        )}
                        {session.clientMarriageYears && (
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>Marriage Years: {session.clientMarriageYears}</span>
                          </div>
                        )}
                      </div>

                      {session.issue && (
                        <div className="flex items-start gap-2 text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                          <p className="text-gray-600 dark:text-gray-300">
                            <span className="font-medium">Issue:</span> {session.issue}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default CounselorSessionHistory;