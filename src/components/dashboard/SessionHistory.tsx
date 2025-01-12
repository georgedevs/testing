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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useGetClientSessionHistoryQuery } from '@/redux/feautures/booking/bookingApi';

const SessionHistory = () => {
  const { data: historyData, isLoading } = useGetClientSessionHistoryQuery();

  const getStatusColor = (status:any) => {
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

  const getSessionTypeIcon = (type:any) => {
    return type === 'virtual' ? (
      <Video className="w-4 h-4" />
    ) : (
      <MapPin className="w-4 h-4" />
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Session History</CardTitle>
        <CardDescription>
          View your past counseling sessions and their details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-4">
            {historyData?.history.map((session) => (
              <Card key={session.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={session.counselorAvatar} alt={session.counselorName} />
                    <AvatarFallback>{session.counselorName[0]}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg">{session.counselorName}</h3>
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

                    <div className="flex items-center gap-2 text-sm">
                      {getSessionTypeIcon(session.type)}
                      <span className="capitalize">{session.type} Session</span>
                    </div>

                    {session.issue && (
                      <div className="flex items-start gap-2 text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                        <AlertCircle className="w-4 h-4 mt-0.5 text-gray-500" />
                        <p className="text-gray-600 dark:text-gray-300">{session.issue}</p>
                      </div>
                    )}

                    {session.counselorRating && (
                      <div className="flex items-center gap-1">
                        {"★".repeat(Math.round(session.counselorRating))}
                        <span className="text-sm text-gray-500">
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