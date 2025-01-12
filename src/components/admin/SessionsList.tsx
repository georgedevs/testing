import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar, Loader2, User, Clock, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useGetAdminSessionsQuery } from '@/redux/feautures/admin/adminDashboardApi';
import { useGetAllCounselorsQuery } from '@/redux/feautures/admin/adminApi';
import DatePicker from '../ui/date-picker';

const ITEMS_PER_PAGE = 10;

export default function SessionsList() {
  const [page, setPage] = useState(1);
  const [selectedCounselor, setSelectedCounselor] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const { data: counselorsData } = useGetAllCounselorsQuery();
  
  const { data, isLoading, error } = useGetAdminSessionsQuery({
    page,
    limit: ITEMS_PER_PAGE,
    counselorId: selectedCounselor || undefined,
    startDate: startDate?.toISOString(),
    endDate: endDate?.toISOString(),
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const clearFilters = () => {
    setSelectedCounselor(null);
    setStartDate(undefined);
    setEndDate(undefined);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500 dark:text-blue-400" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load sessions
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Stats Card */}
      <Card className="bg-white dark:bg-gray-800 border-none shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Sessions Overview
          </CardTitle>
          <Calendar className="h-5 w-5 text-blue-500 dark:text-blue-400" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Sessions</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                {data?.data.pagination.totalItems || 0}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <div className="flex flex-wrap gap-4">
          <Select 
            value={selectedCounselor || undefined} 
            onValueChange={setSelectedCounselor}
          >
            <SelectTrigger className="w-[200px] bg-transparent border-gray-200 dark:border-gray-700">
              <SelectValue placeholder="Filter by counselor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Counselors</SelectItem>
              {counselorsData?.counselors.map((counselor: any) => (
                <SelectItem key={counselor._id} value={counselor._id}>
                  {counselor.fullName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="gap-2 bg-transparent border-gray-200 dark:border-gray-700">
                <Filter className="h-4 w-4" />
                Date Range
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter by Date Range</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Date</label>
                  <DatePicker
                    date={startDate}
                    setDate={setStartDate}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">End Date</label>
                  <DatePicker
                    date={endDate}
                    setDate={setEndDate}
                    className="w-full"
                  />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {(selectedCounselor || startDate || endDate) && (
          <Button 
            variant="ghost" 
            onClick={clearFilters}
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Sessions List */}
      <div className="space-y-4">
        {data?.data.sessions.map((session: any) => (
          <Card 
            key={session._id} 
            className="transform transition-all duration-200 hover:scale-[1.02] hover:shadow-xl bg-white dark:bg-gray-800 border-none"
          >
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Client Info */}
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900">
                      {session.clientId.avatar?.imageUrl ? (
                        <img 
                          src={session.clientId.avatar.imageUrl} 
                          alt={`${session.clientId.username}'s avatar`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-6 h-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">{session.clientId.username}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Client</p>
                    </div>
                  </div>
                </div>

                {/* Session Details */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <Clock className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                    <span className="text-sm">
                      {format(new Date(session.meetingDate), 'PPP')} at {session.meetingTime}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{session.issueDescription}</p>
                </div>
              </div>

              {/* Counselor Info */}
              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900">
                    {session.counselorId.avatar?.imageUrl ? (
                      <img 
                        src={session.counselorId.avatar.imageUrl} 
                        alt={`${session.counselorId.fullName}'s avatar`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Counselor</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{session.counselorId.fullName}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {data?.data.pagination && (
        <div className="flex items-center justify-between mt-8 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {((page - 1) * ITEMS_PER_PAGE) + 1} to{' '}
            {Math.min(page * ITEMS_PER_PAGE, data.data.pagination.totalItems)} of{' '}
            {data.data.pagination.totalItems} sessions
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="gap-1 bg-transparent border-gray-200 dark:border-gray-700"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === data.data.pagination.totalPages}
              className="gap-1 bg-transparent border-gray-200 dark:border-gray-700"
            >
              Next <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}