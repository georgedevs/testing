// src/hooks/useSocketUpdates.ts
import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { apiSlice } from '@/redux/feautures/api/apiSlice';
import { useDispatch } from 'react-redux';

// Define the valid tag types
type TagTypes = 
  | 'User'
  | 'Notification'
  | 'Counselors'
  | 'Avatar'
  | 'MeetingRequests'
  | 'ActiveBooking'
  | 'CounselorMeetings'
  | 'PendingMeetings'
  | 'AdminMeetings'
  | 'AdminAnalytics'
  | 'AdminSessions'
  | 'AdminFeedback';

export const useSocketUpdates = (socket: any) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const isAuthenticated = useRef(false);

  useEffect(() => {
    if (!socket || !user) return;

    if (isAuthenticated.current) return;

    socket.emit('authenticate', {
      userId: user._id,
      role: user.role
    });

    isAuthenticated.current = true;

    // Helper function to safely invalidate tags
    const invalidateTags = (tags: TagTypes[]) => {
      tags.forEach(tag => {
        dispatch(apiSlice.util.invalidateTags([{ type: tag }]));
      });
    };

    const handlers = {
      booking_updated: () => {
        invalidateTags(['ActiveBooking']);
      },
      counselor_assigned: () => {
        invalidateTags([
          'ActiveBooking',
          'CounselorMeetings',
          'Counselors'
        ]);
      },
      new_assignment: () => {
        invalidateTags([
          'CounselorMeetings',
          'PendingMeetings'
        ]);
      },
      admin_update: (data: { type: string }) => {
        if (user.role === 'admin') {
          switch (data.type) {
            case 'new_booking':
              invalidateTags(['MeetingRequests']);
              break;
            case 'assignment':
              invalidateTags(['MeetingRequests', 'Counselors']);
              break;
            default:
              invalidateTags([
                'MeetingRequests',
                'AdminMeetings',
                'AdminAnalytics'
              ]);
          }
        }
      }
    };

    // Register event listeners
    Object.entries(handlers).forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    // Cleanup
    return () => {
      Object.entries(handlers).forEach(([event]) => {
        socket.off(event);
      });
      isAuthenticated.current = false;
    };
  }, [socket, user, dispatch]);

  return socket;
};