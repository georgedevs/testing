// src/components/counselor/CounselorNotifications.tsx
'use client'
import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Loader2, 
  Calendar, 
  Star, 
  UserCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  Trash2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSocket } from '@/components/SocketProvider';
import { format } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';
import { toast } from 'sonner';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'new_assignment' | 'time_selected' | 'meeting_confirmed' | 'new_rating' | 'meeting_cancelled';
  linkTo?: string;
  createdAt: Date;
  read: boolean;
  data?: any;
}

export const CounselorNotifications = () => {
  const socket = useSocket();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hasUnread, setHasUnread] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!socket) return;

    const handleNewAssignment = (data: any) => {
      addNotification({
        title: 'New Client Assignment',
        message: `You have been assigned a new client for ${data.meetingType} counseling`,
        type: 'new_assignment',
        linkTo: '/counselor/meetings',
        data
      });
    };

    const handleTimeSelected = (data: any) => {
      addNotification({
        title: 'Meeting Time Selected',
        message: `A client has selected ${data.meetingTime} on ${format(new Date(data.meetingDate), 'PPP')}`,
        type: 'time_selected',
        linkTo: '/counselor/meetings',
        data
      });
    };

    const handleMeetingConfirmed = (data: any) => {
      addNotification({
        title: 'Meeting Confirmed',
        message: `Meeting confirmed for ${format(new Date(data.meetingDate), 'PPP')} at ${data.meetingTime}`,
        type: 'meeting_confirmed',
        linkTo: '/counselor/meetings',
        data
      });
    };

    const handleNewRating = (data: any) => {
      addNotification({
        title: 'New Rating Received',
        message: `You received a ${data.rating}-star rating${data.feedback ? ': ' + data.feedback : ''}`,
        type: 'new_rating',
        linkTo: '/counselor/feedback',
        data
      });
    };

    const handleMeetingCancelled = (data: any) => {
      addNotification({
        title: 'Meeting Cancelled',
        message: `A meeting has been cancelled. Reason: ${data.cancellationReason || 'No reason provided'}`,
        type: 'meeting_cancelled',
        linkTo: '/counselor/meetings',
        data
      });
    };

    // Register event listeners
    socket.on('new_assignment', handleNewAssignment);
    socket.on('time_selected', handleTimeSelected);
    socket.on('meeting_confirmed', handleMeetingConfirmed);
    socket.on('new_rating', handleNewRating);
    socket.on('meeting_cancelled', handleMeetingCancelled);

    // Cleanup
    return () => {
      socket.off('new_assignment', handleNewAssignment);
      socket.off('time_selected', handleTimeSelected);
      socket.off('meeting_confirmed', handleMeetingConfirmed);
      socket.off('new_rating', handleNewRating);
      socket.off('meeting_cancelled', handleMeetingCancelled);
    };
  }, [socket]);

  const addNotification = (notificationData: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const newNotification: Notification = {
      ...notificationData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev]);
    setHasUnread(true);
    playNotificationSound();
  };

  const playNotificationSound = () => {
    const audio = new Audio('/sounds/notification.mp3');
    audio.play().catch(error => console.log('Error playing sound:', error));
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
    setHasUnread(false);
    toast.success('All notifications marked as read');
  };

  const deleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
    const remainingUnread = notifications.filter(n => !n.read && n.id !== id).length;
    if (remainingUnread === 0) {
      setHasUnread(false);
    }
    toast.success('Notification deleted');
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'new_assignment':
        return <UserCheck className="h-4 w-4 text-blue-500" />;
      case 'time_selected':
        return <Clock className="h-4 w-4 text-green-500" />;
      case 'meeting_confirmed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'new_rating':
        return <Star className="h-4 w-4 text-yellow-500" />;
      case 'meeting_cancelled':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full relative hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
        >
          <Bell className="h-5 w-5" />
          {hasUnread && (
            <span className="absolute top-2 right-2 h-2 w-2 bg-blue-600 rounded-full" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96">
        <div className="flex items-center justify-between px-4 py-2">
          <h3 className="font-medium">Notifications</h3>
          {notifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs text-blue-500 hover:text-blue-600"
            >
              Mark all as read
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        <ScrollArea className="h-[400px]">
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            </div>
          ) : notifications.length > 0 ? (
            notifications.map((notification) => (
              <Link
                key={notification.id}
                href={notification.linkTo || '#'}
                className="block"
              >
                <DropdownMenuItem
                  className={`px-4 py-3 cursor-pointer ${
                    !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  <div className="flex items-start gap-3 w-full">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {notification.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 break-words">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {format(notification.createdAt, 'PPp')}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-400 hover:text-red-500"
                      onClick={(e) => deleteNotification(notification.id, e)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </DropdownMenuItem>
              </Link>
            ))
          ) : (
            <div className="py-8 text-center text-gray-500 dark:text-gray-400">
              <Bell className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p>No notifications</p>
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};