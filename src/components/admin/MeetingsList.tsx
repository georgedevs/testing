import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar, Loader2, User, VideoIcon, Users, Filter, ChevronDown } from 'lucide-react';
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
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useGetAdminMeetingsQuery } from '@/redux/feautures/admin/adminDashboardApi';
import DatePicker from '../ui/date-picker';
import { MeetingType } from '@/redux/feautures/booking/bookingApi';
import { MeetingStatus } from '@/redux/feautures/booking/bookingApi';

const ITEMS_PER_PAGE = 10;

const STATUS_OPTIONS = {
  ALL: 'all',
  REQUEST_PENDING: 'request_pending',
  COUNSELOR_ASSIGNED: 'counselor_assigned',
  TIME_SELECTED: 'time_selected',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  ABANDONED: 'abandoned',
} as const;

const MEETING_TYPE_OPTIONS = {
  ALL: 'all',
  VIRTUAL: 'virtual',
  PHYSICAL: 'physical',
} as const;

type StatusOption = typeof STATUS_OPTIONS[keyof typeof STATUS_OPTIONS];
type MeetingTypeOption = typeof MEETING_TYPE_OPTIONS[keyof typeof MEETING_TYPE_OPTIONS];


export default function MeetingsList() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<StatusOption>(STATUS_OPTIONS.ALL);
  const [meetingType, setMeetingType] = useState<MeetingTypeOption>(MEETING_TYPE_OPTIONS.ALL);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const { data, isLoading, error } = useGetAdminMeetingsQuery({
    page,
    limit: ITEMS_PER_PAGE,
    status: status !== STATUS_OPTIONS.ALL ? (status as MeetingStatus) : undefined,
    meetingType: meetingType !== MEETING_TYPE_OPTIONS.ALL ? (meetingType as MeetingType) : undefined,
    startDate: startDate?.toISOString(),
    endDate: endDate?.toISOString(),
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value as StatusOption);
  };
  
  const handleMeetingTypeChange = (value: string) => {
    setMeetingType(value as MeetingTypeOption);
  };

  const clearFilters = () => {
    setStatus(STATUS_OPTIONS.ALL);
    setMeetingType(MEETING_TYPE_OPTIONS.ALL);
    setStartDate(undefined);
    setEndDate(undefined);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground animate-pulse">Loading meetings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="animate-in fade-in-50">
        <AlertDescription>
          Failed to load meetings. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  const renderStatusBadge = (status: string) => {
    const statusConfig = {
      request_pending: {
        className: 'bg-yellow-500/10 text-yellow-500 dark:bg-yellow-500/20',
        label: 'Pending'
      },
      counselor_assigned: {
        className: 'bg-blue-500/10 text-blue-500 dark:bg-blue-500/20',
        label: 'Assigned'
      },
      time_selected: {
        className: 'bg-purple-500/10 text-purple-500 dark:bg-purple-500/20',
        label: 'Scheduled'
      },
      confirmed: {
        className: 'bg-green-500/10 text-green-500 dark:bg-green-500/20',
        label: 'Confirmed'
      },
      cancelled: {
        className: 'bg-red-500/10 text-red-500 dark:bg-red-500/20',
        label: 'Cancelled'
      },
      completed: {
        className: 'bg-gray-500/10 text-gray-500 dark:bg-gray-500/20',
        label: 'Completed'
      },
      abandoned: {
        className: 'bg-orange-500/10 text-orange-500 dark:bg-orange-500/20',
        label: 'Abandoned'
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge variant="outline" className={`${config.className} font-medium`}>
        {config.label}
      </Badge>
    );
  };

  const renderAvatar = (user: any, size: 'sm' | 'lg' = 'lg') => {
    const dimensions = size === 'lg' ? 'w-12 h-12' : 'w-10 h-10';
    const iconSize = size === 'lg' ? 'w-6 h-6' : 'w-5 h-5';

    return (
      <div className={`relative ${dimensions} rounded-full overflow-hidden bg-secondary/50 ring-2 ring-background dark:ring-secondary/20 transition-transform hover:scale-105`}>
        {user?.avatar?.imageUrl ? (
          <img 
            src={user.avatar.imageUrl} 
            alt={`${user.username || user.fullName || 'User'}'s avatar`}
            className="w-full h-full object-cover"
          />
        ) : (
          <User className={`${iconSize} absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-muted-foreground`} />
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in-50">
      {/* Stats Card */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 border-none shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold text-primary">
            Meeting Overview
          </CardTitle>
          <Calendar className="h-5 w-5 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-3xl font-bold text-primary">
                {data?.data.pagination.totalItems || 0}
              </p>
              <p className="text-sm text-muted-foreground">Total Meetings</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-500">
                {data?.data.meetings.filter(m => m.status === 'completed').length || 0}
              </p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-yellow-500">
                {data?.data.meetings.filter(m => m.status === 'request_pending').length || 0}
              </p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 sticky top-0 z-10 bg-background/80 backdrop-blur-lg p-4 -mx-4 shadow-sm">
        <div className="flex flex-wrap gap-3">
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[180px] bg-background">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={STATUS_OPTIONS.ALL}>All Statuses</SelectItem>
              <SelectItem value={STATUS_OPTIONS.REQUEST_PENDING}>Pending</SelectItem>
              <SelectItem value={STATUS_OPTIONS.COUNSELOR_ASSIGNED}>Assigned</SelectItem>
              <SelectItem value={STATUS_OPTIONS.TIME_SELECTED}>Time Selected</SelectItem>
              <SelectItem value={STATUS_OPTIONS.CONFIRMED}>Confirmed</SelectItem>
              <SelectItem value={STATUS_OPTIONS.COMPLETED}>Completed</SelectItem>
              <SelectItem value={STATUS_OPTIONS.CANCELLED}>Cancelled</SelectItem>
              <SelectItem value={STATUS_OPTIONS.ABANDONED}>Abandoned</SelectItem>
            </SelectContent>
          </Select>

          <Select value={meetingType} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[180px] bg-background">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={MEETING_TYPE_OPTIONS.ALL}>All Types</SelectItem>
              <SelectItem value={MEETING_TYPE_OPTIONS.VIRTUAL}>Virtual</SelectItem>
              <SelectItem value={MEETING_TYPE_OPTIONS.PHYSICAL}>Physical</SelectItem>
            </SelectContent>
          </Select>

          {(status !== STATUS_OPTIONS.ALL || 
            meetingType !== MEETING_TYPE_OPTIONS.ALL || 
            startDate || 
            endDate) && (
            <Button 
              variant="ghost" 
              onClick={clearFilters} 
              className="h-10 text-muted-foreground hover:text-primary"
            >
              Clear Filters
            </Button>
          )}
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Date Range
              <ChevronDown className="h-4 w-4 ml-2" />
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

      {/* Meetings List */}
      <div className="space-y-4">
        {data?.data.meetings.map((meeting, index) => (
          <Card 
            key={meeting._id} 
            className="group hover:shadow-lg transition-all duration-300 bg-card/50 hover:bg-card border-muted/50 hover:border-primary/20"
            style={{
              animationDelay: `${index * 50}ms`,
            }}
          >
            <CardContent className="p-6">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Client Info */}
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    {renderAvatar(meeting.clientId)}
                    <div className="space-y-1">
                      <p className="font-semibold group-hover:text-primary transition-colors">
                        {meeting.clientId?.username || 'Unknown Client'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {meeting.clientId?.email || 'No email provided'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Meeting Details */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    {meeting.meetingType === 'virtual' ? (
                      <VideoIcon className="h-4 w-4 text-blue-500" />
                    ) : (
                      <Users className="h-4 w-4 text-green-500" />
                    )}
                    <span className="capitalize font-medium">
                      {meeting.meetingType} Session
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {meeting.issueDescription || 'No description provided'}
                  </p>
                </div>

                {/* Status and Time */}
                <div className="space-y-3">
                  <div>{renderStatusBadge(meeting.status)}</div>
                  {meeting.meetingDate && meeting.meetingTime && (
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {format(new Date(meeting.meetingDate), 'PPP')} at {meeting.meetingTime}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Counselor Info */}
              {meeting.counselorId && (
                <div className="mt-4 pt-4 border-t border-border/50">
                  <div className="flex items-center gap-3">
                    {renderAvatar(meeting.counselorId, 'sm')}
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Counselor</p>
                      <p className="text-sm font-medium">
                        {meeting.counselorId.fullName || 'Unknown Counselor'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {data?.data.meetings.length === 0 && (
          <Card className="bg-muted/50">
            <CardContent className="p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <Calendar className="h-12 w-12 text-muted-foreground" />
                <p className="text-lg font-medium text-muted-foreground">No meetings found</p>
                <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

{/* Previous content remains the same until the pagination section */}

      {/* Pagination */}
      {data?.data.pagination && data.data.meetings.length > 0 && (
        <div className="flex items-center justify-between mt-8 sticky bottom-0 bg-background/80 backdrop-blur-lg p-4 -mx-4 border-t border-border">
          <div className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              {((page - 1) * ITEMS_PER_PAGE) + 1}
            </span>
            {' '}-{' '}
            <span className="font-medium text-foreground">
              {Math.min(page * ITEMS_PER_PAGE, data.data.pagination.totalItems)}
            </span>
            {' '}of{' '}
            <span className="font-medium text-foreground">
              {data.data.pagination.totalItems}
            </span>
            {' '}meetings
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="group"
            >
              <ChevronDown className="h-4 w-4 rotate-90 text-muted-foreground group-hover:text-primary transition-colors mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === data.data.pagination.totalPages}
              className="group"
            >
              Next
              <ChevronDown className="h-4 w-4 -rotate-90 text-muted-foreground group-hover:text-primary transition-colors ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}