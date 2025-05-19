import { apiSlice } from "../api/apiSlice";
import { ClientInfo , CounselorInfo, MeetingType, MeetingStatus} from "../booking/bookingApi";
import { BaseMeeting } from "../booking/bookingApi";

// Interfaces 
export interface Meeting extends BaseMeeting {
  clientId: ClientInfo; 
  counselorId: CounselorInfo;
}

export interface SessionRecord extends Meeting {
  rating?: number;
  feedback?: string;
}

interface FeedbackItem {
  sessionId: string;
  clientUsername: string;
  counselorName: string;
  counselorEmail: string;
  sessionDate: string;
  meetingType: string;
  rating: number;
  feedback?: string;
  issueDescription: string;
}

interface FeedbackStatistics {
  totalRatings: number;
  averageRating: string;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

interface AnalyticsData {
  overview: {
    totalMeetings: number;
    completedMeetings: number;
    cancelledMeetings: number;
    noShowMeetings: number;
    completionRate: string;
  };
  growth: {
    currentMonthMeetings: number;
    lastMonthMeetings: number;
    monthlyGrowth: string;
  };
  distribution: {
    virtualMeetings: number;
    physicalMeetings: number;
    virtualPercentage: string;
    physicalPercentage: string;
  };
  counselorMetrics: {
    _id: string;
    fullName: string;
    averageRating: number;
    totalSessions: number;
  }[];
}

// Response types
interface MeetingsResponse {
  success: boolean;
  data: {
    meetings: Meeting[];
    pagination: PaginationInfo;
  };
}

interface SessionsResponse {
  success: boolean;
  data: {
    sessions: SessionRecord[];
    pagination: PaginationInfo;
  };
}

interface FeedbackResponse {
  success: boolean;
  data: {
    feedback: FeedbackItem[];
    statistics: FeedbackStatistics;
    pagination: PaginationInfo;
  };
}

interface AnalyticsResponse {
  success: boolean;
  analytics: AnalyticsData;
}

// Query parameters interfaces
interface ListQueryParams {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}

interface MeetingQueryParams extends ListQueryParams {
  status?: MeetingStatus;
  meetingType?: MeetingType;
}

interface SessionQueryParams extends ListQueryParams {
  counselorId?: string;
}

interface FeedbackQueryParams extends ListQueryParams {
  minRating?: number;
  maxRating?: number;
  counselorId?: string;
}

export const adminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Meetings endpoints
    getAdminMeetings: builder.query<MeetingsResponse, MeetingQueryParams>({
      query: (params) => ({
        url: '/meetings',
        method: 'GET',
        params,
        credentials: 'include' as const,
      }),
      providesTags: ['AdminMeetings'],
    }),

    // Analytics endpoints
    getDashboardAnalytics: builder.query<AnalyticsResponse, void>({
      query: () => ({
        url: '/analytics',
        method: 'GET',
        credentials: 'include' as const,
      }),
      providesTags: ['AdminAnalytics'],
    }),

    // Sessions endpoints
    getAdminSessions: builder.query<SessionsResponse, SessionQueryParams>({
      query: (params) => ({
        url: '/sessions',
        method: 'GET',
        params,
        credentials: 'include' as const,
      }),
      providesTags: ['AdminSessions'],
    }),

    // Feedback endpoints
    getAdminFeedback: builder.query<FeedbackResponse, FeedbackQueryParams>({
      query: (params) => ({
        url: '/feedback',
        method: 'GET',
        params,
        credentials: 'include' as const,
      }),
      providesTags: ['AdminFeedback'],
    }),
  }),
});

// Export hooks
export const {
  useGetAdminMeetingsQuery,
  useGetDashboardAnalyticsQuery,
  useGetAdminSessionsQuery,
  useGetAdminFeedbackQuery,
} = adminApi;