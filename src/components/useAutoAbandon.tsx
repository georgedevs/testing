import { useEffect } from 'react';
import { isAfter, parseISO, addMinutes } from 'date-fns';

// This hook automatically marks a session as abandoned if it hasn't been joined
// within 15 minutes of the scheduled start time
export const useAutoAbandon = (booking: any) => {
  useEffect(() => {
    if (
      !booking || 
      !booking.meetingDate || 
      !booking.meetingTime || 
      booking.status !== 'confirmed'
    ) {
      return;
    }

    try {
      // Safely parse the meeting date
      let meetingDateTime: Date;
      
      if (typeof booking.meetingDate === 'string') {
        // Handle string date formats
        try {
          if (booking.meetingDate.includes('T')) {
            // ISO string format
            meetingDateTime = parseISO(booking.meetingDate);
          } else {
            // Date string without time
            const dateStr = new Date(booking.meetingDate).toISOString().split('T')[0];
            meetingDateTime = new Date(`${dateStr}T${booking.meetingTime}`);
          }
        } catch (err) {
          console.error('Error parsing meeting date string:', err);
          return;
        }
      } else if (booking.meetingDate instanceof Date) {
        // Handle Date object
        const dateStr = booking.meetingDate.toISOString().split('T')[0];
        meetingDateTime = new Date(`${dateStr}T${booking.meetingTime}`);
      } else {
        // Invalid date format
        console.error('Invalid meeting date format');
        return;
      }

      // Check if meetingDateTime is valid
      if (isNaN(meetingDateTime.getTime())) {
        console.error('Invalid meeting date/time');
        return;
      }

      // Calculate abandon time (15 minutes after scheduled start)
      const abandonTime = addMinutes(meetingDateTime, 15);
      
      // Get current time
      const now = new Date();

      // Session end time (45 minutes after start)
      const sessionEndTime = addMinutes(meetingDateTime, 45);

      // Check if we're past the abandon time but before the session end time
      // AND if the session is still in 'confirmed' status (meaning it hasn't been joined)
      const shouldAbandon = isAfter(now, abandonTime) && 
                           !isAfter(now, sessionEndTime) &&
                           booking.status === 'confirmed';

      // Debug logging
      console.log('Auto abandon check:', {
        now: now.toISOString(),
        meetingTime: meetingDateTime.toISOString(),
        abandonTime: abandonTime.toISOString(),
        sessionEndTime: sessionEndTime.toISOString(),
        shouldAbandon
      });

      if (shouldAbandon) {
        console.log('Session should be marked as abandoned - no one joined within 15 minutes');
        

        // Report no-show
        fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/report-no-show`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            meetingId: booking._id,
            noShowReason: 'Auto-abandoned: No one joined within 15 minutes of scheduled time'
          })
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to mark session as abandoned');
          }
          return response.json();
        })
        .then(data => {
          console.log('Session marked as abandoned:', data);
        })
        .catch(error => {
          console.error('Error handling session abandonment:', error);
        });
      }
    } catch (error) {
      console.error('Error handling session abandonment:', error);
    }
  }, [booking]);
};