import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import {
  Star,
  Loader2,
  SlidersHorizontal,
  TrendingUp,
  Star as StarIcon,
  MessageSquare
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";    
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import { useGetAllCounselorsQuery } from '@/redux/feautures/admin/adminApi';
import { useGetAdminFeedbackQuery } from '@/redux/feautures/admin/adminDashboardApi';

const ITEMS_PER_PAGE = 10;
const RATING_COLORS = {
  1: '#ef4444',  // red-500
  2: '#f97316',  // orange-500
  3: '#eab308',  // yellow-500
  4: '#84cc16',  // lime-500
  5: '#22c55e',  // green-500
};

export default function FeedbackList() {
  const [page, setPage] = useState(1);
  const [counselorId, setCounselorId] = useState<string | null>(null);
  const [minRating, setMinRating] = useState<string | null>(null);
  const [maxRating, setMaxRating] = useState<string | null>(null);

  const { data: counselorsData } = useGetAllCounselorsQuery();
  
  const { data, isLoading, error } = useGetAdminFeedbackQuery({
    page,
    limit: ITEMS_PER_PAGE,
    counselorId: counselorId || undefined,
    minRating: minRating ? parseInt(minRating) : undefined,
    maxRating: maxRating ? parseInt(maxRating) : undefined,
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'PPP');
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const clearFilters = () => {
    setCounselorId(null);
    setMinRating(null);
    setMaxRating(null);
  };

  const handleCounselorChange = (value: string | null) => {
    setCounselorId(value);
  };

  const handleRatingChange = (setter: (value: string | null) => void) => (value: string) => {
    setter(value || null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load feedback data
        </AlertDescription>
      </Alert>
    );
  }

  const renderRatingStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-sm font-medium">{rating}/5</span>
      </div>
    );
  };

  // Prepare data for the rating distribution chart
  const distributionData = Object.entries(data?.data.statistics.ratingDistribution || {}).map(
    ([rating, count]) => ({
      name: `${rating} Star`,
      value: count,
    })
  );

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Ratings</CardTitle>
            <StarIcon className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.data.statistics.totalRatings || 0}</div>
            <p className="text-xs text-gray-500">Overall feedback received</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.data.statistics.averageRating || 0}/5</div>
            <p className="text-xs text-gray-500">Overall satisfaction score</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Feedback Rate</CardTitle>
            <MessageSquare className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.data.feedback.filter(f => f.feedback).length || 0}
            </div>
            <p className="text-xs text-gray-500">Written feedback received</p>
          </CardContent>
        </Card>
      </div>

      {/* Rating Distribution Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Rating Distribution</CardTitle>
          <CardDescription>
            Distribution of ratings across all sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {distributionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={RATING_COLORS[((index + 1) as 1 | 2 | 3 | 4 | 5)]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-wrap gap-4">
          <Select value={counselorId || undefined} onValueChange={handleCounselorChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by counselor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Counselors</SelectItem>
              {counselorsData?.counselors.map((counselor:any) => (
                <SelectItem key={counselor._id} value={counselor._id}>
                  {counselor.fullName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Rating Range
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter by Rating Range</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Minimum Rating</label>
                  <Select value={minRating || undefined} onValueChange={handleRatingChange(setMinRating)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select minimum" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Rating</SelectItem>
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <SelectItem key={rating} value={rating.toString()}>
                          {rating} Star{rating !== 1 && 's'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Maximum Rating</label>
                  <Select value={maxRating || undefined} onValueChange={handleRatingChange(setMaxRating)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select maximum" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Rating</SelectItem>
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <SelectItem key={rating} value={rating.toString()}>
                          {rating} Star{rating !== 1 && 's'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {(counselorId || minRating || maxRating) && (
          <Button variant="ghost" onClick={clearFilters}>
            Clear Filters
          </Button>
        )}
      </div>

      {/* Feedback List */}
      <div className="space-y-4">
        {data?.data.feedback.map((feedback: any) => (
          <Card key={feedback.sessionId} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">Client: {feedback.clientUsername}</h3>
                    <p className="text-sm text-gray-500">
                      Session Date: {formatDate(feedback.sessionDate)}
                    </p>
                  </div>
                  {renderRatingStars(feedback.rating)}
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Counselor</h4>
                  <p>{feedback.counselorName}</p>
                  <p className="text-sm text-gray-500">{feedback.counselorEmail}</p>
                </div>

                {feedback.feedback && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Feedback</h4>
                    <p className="mt-1 text-gray-600 italic">"{feedback.feedback}"</p>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Session Details</h4>
                  <p className="mt-1 text-gray-600">{feedback.issueDescription}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {data?.data.pagination && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-600">
            Showing {((page - 1) * ITEMS_PER_PAGE) + 1} to{' '}
            {Math.min(page * ITEMS_PER_PAGE, data.data.pagination.totalItems)} of{' '}
            {data.data.pagination.totalItems} reviews
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === data.data.pagination.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}