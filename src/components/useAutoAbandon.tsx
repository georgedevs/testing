import { useEffect } from 'react';
import { addMinutes, isAfter } from 'date-fns';
import { useRouter } from 'next/navigation';

export const useAutoAbandon = (meeting: any) => {
  const router = useRouter();

  useEffect(() => {
    if (!meeting?.meetingDate || !meeting?.meetingTime || meeting?.status !== 'confirmed') return;

    const checkAndHandleAbandonment = async () => {
      try {
        // Create meeting datetime
        const meetingDateTime = new Date(`${meeting.meetingDate.toISOString().split('T')[0]}T${meeting.meetingTime}`);
        const abandonmentTime = addMinutes(meetingDateTime, 15); // 15 minutes after scheduled start
        
        // If current time is after abandonment time and status is still 'confirmed'
        if (isAfter(new Date(), abandonmentTime)) {
          // Report no-show
          await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/report-no-show`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
              meetingId: meeting._id,
              noShowReason: 'Neither party joined within 15 minutes of scheduled start time'
            })
          });

          // Redirect based on user type
          const redirectPath = window.location.pathname.includes('/counselor') 
            ? '/counselor/history'
            : '/dashboard/history';
          
          await router.push(redirectPath);
          
          // Reload to refresh data
          setTimeout(() => {
            window.location.reload();
          }, 100);
        }
      } catch (error) {
        console.error('Error handling session abandonment:', error);
      }
    };

    // Initial check
    checkAndHandleAbandonment();

    // Set up interval to check every minute
    const intervalId = setInterval(checkAndHandleAbandonment, 60000);

    return () => clearInterval(intervalId);
  }, [meeting?.meetingDate, meeting?.meetingTime, meeting?.status, meeting?._id, router]);
};