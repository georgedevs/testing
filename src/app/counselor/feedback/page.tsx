"use client"
import React from 'react';
import Heading from '@/components/Heading';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { DashboardHeader } from '@/components/counselor/DashboardHeader';
import { CounselorSidebar } from '@/components/counselor/CounselorSidebar';
import { useGetCounselorFeedbackQuery } from '@/redux/feautures/booking/bookingApi';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Star, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const ITEMS_PER_PAGE = 10;

const CounselorFeedbackPage = () => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [sortBy, setSortBy] = React.useState('date');
  const [order, setOrder] = React.useState<'asc' | 'desc'>('desc');

  const { data, isLoading } = useGetCounselorFeedbackQuery({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    sortBy,
    order,
  });

  const handleSort = (newSortBy: string) => {
    if (sortBy === newSortBy) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setOrder('desc');
    }
  };

  return (
    <>
      <ProtectedRoute allowedRoles={['counselor']}>
        <Heading 
          title="Client Feedback"
          description="Review your client feedback and ratings"
          keywords="counselor, feedback, ratings, reviews, counseling"
        />
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900">
          <DashboardHeader />
          <CounselorSidebar />
          <main className="lg:ml-72 p-4 lg:p-6 lg:mt-16 mt-4">
            <div className="max-w-screen-2xl mx-auto space-y-6">
              {/* Header Section */}
              <div className="p-6 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl shadow-gray-900/10">
                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent mb-4">
                  Client Feedback Overview
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Monitor and analyze feedback from your counseling sessions
                </p>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              ) : (
                <>
                  {/* Statistics Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-gray-200/50 dark:border-gray-700/50">
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold">{data?.data.statistics?.totalRatings}</div>
                        <p className="text-sm text-muted-foreground">Total Ratings</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-gray-200/50 dark:border-gray-700/50">
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold flex items-center gap-2">
                          {data?.data.statistics?.averageRating}
                          <Star className="w-5 h-5 text-yellow-400 fill-current" />
                        </div>
                        <p className="text-sm text-muted-foreground">Average Rating</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-gray-200/50 dark:border-gray-700/50 md:col-span-2">
                      <CardContent className="pt-6">
                        <div className="space-y-2">
                          {data?.data.statistics?.ratingDistribution && 
                            Object.entries(data.data.statistics.ratingDistribution)
                              .sort((a, b) => Number(b[0]) - Number(a[0]))
                              .map(([rating, count]) => (
                                <div key={rating} className="flex items-center gap-2">
                                  <span className="text-sm">{rating} ★</span>
                                  <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                                    <div
                                      className="h-full bg-blue-500 rounded-full"
                                      style={{
                                        width: `${(count / data.data.statistics.totalRatings) * 100}%`
                                      }}
                                    />
                                  </div>
                                  <span className="text-sm">{count}</span>
                                </div>
                              ))
                          }
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Feedback Table */}
                  <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-gray-200/50 dark:border-gray-700/50">
                    <CardHeader>
                      <CardTitle>Session Feedback</CardTitle>
                      <CardDescription>
                        Review feedback from your counseling sessions
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-md border border-gray-200 dark:border-gray-700">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>
                                <Button
                                  variant="ghost"
                                  onClick={() => handleSort('date')}
                                  className="flex items-center gap-1"
                                >
                                  Date
                                  <ArrowUpDown className="w-4 h-4" />
                                </Button>
                              </TableHead>
                              <TableHead>Client</TableHead>
                              <TableHead>
                                <Button
                                  variant="ghost"
                                  onClick={() => handleSort('rating')}
                                  className="flex items-center gap-1"
                                >
                                  Rating
                                  <ArrowUpDown className="w-4 h-4" />
                                </Button>
                              </TableHead>
                              <TableHead>Feedback</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {data?.data.feedback.map((item) => (
                              <TableRow key={item.sessionId}>
                                <TableCell>
                                  <div className="space-y-1">
                                    <div>{item.sessionDate}</div>
                                    <div className="text-sm text-gray-500">{item.sessionTime}</div>
                                  </div>
                                </TableCell>
                                <TableCell>{item.clientUsername}</TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-1">
                                    {item.rating}
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {item.feedback || <span className="text-gray-400">No feedback provided</span>}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      {/* Pagination */}
                      {data?.data.pagination && (
                        <div className="flex items-center justify-between mt-4">
                          <div className="text-sm text-gray-500">
                            Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to{' '}
                            {Math.min(currentPage * ITEMS_PER_PAGE, data.data.pagination.totalItems)} of{' '}
                            {data.data.pagination.totalItems} results
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                              disabled={currentPage === 1}
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCurrentPage(prev => 
                                Math.min(data.data.pagination.totalPages, prev + 1)
                              )}
                              disabled={currentPage === data.data.pagination.totalPages}
                            >
                              <ChevronRight className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </main>
        </div>
      </ProtectedRoute>
    </>
  );
};

export default CounselorFeedbackPage;