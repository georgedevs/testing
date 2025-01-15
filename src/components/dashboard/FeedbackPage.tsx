import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGetClientSessionHistoryQuery, useRateSessionMutation, useGetSessionRatingStatusQuery } from '@/redux/feautures/booking/bookingApi';
import { Loader2, Star, Calendar, Clock, Video, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

const FeedbackPage = () => {
  const router = useRouter();
  const [selectedSession, setSelectedSession] = useState(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ratedSessions, setRatedSessions] = useState({});
  
  const { data: historyData, isLoading } = useGetClientSessionHistoryQuery();
  const [rateSession] = useRateSessionMutation();
  const { data: ratingStatus } = useGetSessionRatingStatusQuery(selectedSession ?? '', {
    skip: !selectedSession,
  });

  useEffect(() => {
    if (ratingStatus?.data?.isRated && selectedSession) {
      setRatedSessions(prev => ({
        ...prev,
        [selectedSession]: true
      }));
    }
  }, [ratingStatus, selectedSession]);

  const handleRatingSubmit = async () => {
    if (isSubmitting) return;
    if (!selectedSession || rating < 1 || rating > 5) {
      toast.error('Please provide a valid rating between 1 and 5');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await rateSession({
        meetingId: selectedSession,
        data: {
          rating,
          feedback: feedback.trim() || undefined
        }
      }).unwrap();

      toast.success(response.message || 'Feedback submitted successfully');
      setRatedSessions(prev => ({
        ...prev,
        [selectedSession]: true
      }));
      setSelectedSession(null);
      setRating(0);
      setFeedback('');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to submit feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarRating = ({ value, onChange, disabled }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Button
            key={star}
            variant="ghost"
            size="sm"
            onClick={() => !disabled && onChange(star)}
            className={`p-1 hover:bg-transparent ${
              star <= value ? 'text-yellow-400' : 'text-gray-300'
            } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
            aria-label={`Rate ${star} stars`}
            type="button"
            disabled={disabled}
          >
            <Star className="w-6 h-6" fill={star <= value ? 'currentColor' : 'none'} />
          </Button>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const unratedSessions = historyData?.history?.filter(
    (session) => session.status === 'completed'
  );

  if (!unratedSessions?.length) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>No Sessions to Rate</CardTitle>
          <CardDescription>
            You don't have any completed sessions to provide feedback for at the moment.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Once you complete a counseling session, you'll be able to rate your experience and provide valuable feedback.
          </p>
          <Button onClick={() => router.push('/dashboard/book')}>
            Book a Session
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Session Feedback</CardTitle>
        <CardDescription>
          Rate your completed sessions and help us improve our service
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-4">
            {unratedSessions.map((session) => {
              const isRated = ratedSessions[session.id];
              
              return (
                <Card key={session.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={session.counselorAvatar} alt="Anonymous Counselor" />
                      <AvatarFallback>{session.counselorName[0]}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg">Anonymous Counselor</h3>
                        <Button 
                          variant={isRated ? "secondary" : "outline"}
                          onClick={() => !isRated && setSelectedSession(session.id)}
                          disabled={isRated}
                        >
                          {isRated ? 'Session Rated' : 'Rate Session'}
                        </Button>
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
                        {session.type === 'virtual' ? (
                          <Video className="w-4 h-4" />
                        ) : (
                          <MapPin className="w-4 h-4" />
                        )}
                        <span className="capitalize">{session.type} Session</span>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </ScrollArea>

        <Dialog 
          open={!!selectedSession} 
          onOpenChange={(open) => {
            if (!open && !isSubmitting) {
              setSelectedSession(null);
              setRating(0);
              setFeedback('');
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rate Your Session</DialogTitle>
              <DialogDescription>
                Share your feedback about your counseling session. Rating is required and must be between 1 and 5 stars.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Rating *</label>
                <StarRating 
                  value={rating} 
                  onChange={setRating}
                  disabled={isSubmitting} 
                />
                {rating < 1 && <p className="text-sm text-red-500">Please select a rating</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Feedback (Optional)</label>
                <Textarea
                  placeholder="Share your thoughts about the session..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={4}
                  maxLength={1000}
                  disabled={isSubmitting}
                />
              </div>

              <Button 
                className="w-full"
                onClick={handleRatingSubmit}
                disabled={rating < 1 || rating > 5 || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Feedback'
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default FeedbackPage;