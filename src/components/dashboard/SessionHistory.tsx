import React from 'react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { Loader2, Calendar, Clock, Video, MapPin, AlertCircle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useGetClientSessionHistoryQuery } from '@/redux/feautures/booking/bookingApi';

const SessionHistory = () => {
  const router = useRouter();
  const { data: historyData, isLoading } = useGetClientSessionHistoryQuery();

  const getStatusColor = (status) => {
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

  const getSessionTypeIcon = (type) => {
    return type === 'virtual' ? (
      <Video className={`w-3 h-3 md:w-4 md:h-4 flex-shrink-0`} />
    ) : (
      <MapPin className={`w-3 h-3 md:w-4 md:h-4 flex-shrink-0`} />
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 md:w-8 md:h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!historyData?.history?.length) {
    return (
      <Card className="max-w-full md:max-w-2xl mx-auto">
        <CardHeader className="px-3 py-4 md:px-6">
          <CardTitle className="text-lg md:text-xl">No Sessions Yet</CardTitle>
          <CardDescription className="text-xs md:text-sm">
            You haven't had any counseling sessions yet. Book your first session to get started.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-3 pb-4 md:px-6">
          <Button size="sm" className="w-full md:w-auto" onClick={() => router.push('/dashboard/book')}>
            Book Your First Session
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1 px-3 py-3 md:px-6 md:py-4">
        <CardTitle className="text-lg md:text-xl lg:text-2xl">Session History</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          View your past counseling sessions and their details
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 md:px-4 lg:px-6">
        <ScrollArea className="h-[450px] md:h-[500px] lg:h-[600px] pr-1 md:pr-2 lg:pr-4">
          <div className="space-y-2 md:space-y-3 lg:space-y-4">
            {historyData.history.map((session) => (
              <Card key={session.id} className="p-2 md:p-3 lg:p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-2 md:gap-3 lg:gap-4">
                  <Avatar className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 flex-shrink-0">
                    <AvatarImage src={session.counselorAvatar} alt={"Anonymous Counselor"} />
                    <AvatarFallback className="text-xs md:text-sm">{session.counselorName[0]}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0 space-y-1 md:space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-1 md:gap-2">
                      <h3 className="font-semibold text-sm md:text-base lg:text-lg truncate max-w-full">
                        {"Anonymous Counselor"}
                      </h3>
                      <Badge 
                        variant="outline" 
                        className={`${getStatusColor(session.status)} capitalize text-xs py-0 px-1.5 md:px-2 md:py-0.5 h-5 md:h-6`}
                      >
                        {session.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 xs:grid-cols-1 sm:grid-cols-2 gap-1 md:gap-2 text-xs md:text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex items-center gap-1 md:gap-2">
                        <Calendar className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                        <span className="truncate">{session.date}</span>
                      </div>
                      <div className="flex items-center gap-1 md:gap-2">
                        <Clock className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                        <span className="truncate">{session.time}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
                      {getSessionTypeIcon(session.type)}
                      <span className="capitalize">{session.type} Session</span>
                    </div>

                    {session.issue && (
                      <div className="flex items-start gap-1 md:gap-2 text-xs md:text-sm bg-gray-50 dark:bg-gray-800 p-1.5 md:p-2 lg:p-3 rounded-lg">
                        <AlertCircle className="w-3 h-3 md:w-4 md:h-4 mt-0.5 text-gray-500 flex-shrink-0" />
                        <p className="text-gray-600 dark:text-gray-300 line-clamp-3 md:line-clamp-none">{session.issue}</p>
                      </div>
                    )}

                    {session.counselorRating && (
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-400 text-xs md:text-sm">
                          {"★".repeat(Math.round(session.counselorRating))}
                        </span>
                        <span className="text-xs text-gray-500">
                          ({session.counselorRating.toFixed(1)})
                        </span>
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
  );
};

export default SessionHistory;