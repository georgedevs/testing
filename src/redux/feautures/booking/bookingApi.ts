import { apiSlice } from "../api/apiSlice";

export type MeetingStatus = 
  | 'request_pending' 
  | 'counselor_assigned' 
  | 'time_selected' 
  | 'confirmed' 
  | 'cancelled' 
  | 'completed' 
  | 'abandoned';

export type MeetingType = 'virtual' | 'physical';

export interface CounselorActiveSessionResponse {
  success: boolean;
  booking: CounselorMeeting | null;
}

export interface ClientInfo {
  _id: string;
  fullName: string;
  email: string;
  avatar?: any;
  username: string;
  marriageYears?:number;
  age?:number;
  preferredCounselorGender?:string
}

export interface CounselorInfo {
  avatar: any;
  _id: string;
  fullName: string;
  email: string;
}

export interface BaseMeeting {
  _id: string;
  meetingType: MeetingType;
  issueDescription: string;
  meetingDate?: string;
  meetingTime?: string;
  status: MeetingStatus;
  createdAt: string;
  updatedAt: string;
  cancellationReason?: string;
  noShowReason?: string;
  noShowReportedBy?: 'client' | 'counselor';
  autoAssigned?: boolean;
}

export interface Meeting extends BaseMeeting {
  clientId: string;
  counselorId?: CounselorInfo;
}

export interface CounselorMeeting extends Omit<BaseMeeting, 'clientId'> {
  clientId: ClientInfo;
}

export interface MeetingRequest {
  _id: string;
  clientId: ClientInfo;
  meetingType: MeetingType;
  issueDescription: string;
  status: MeetingStatus;
  createdAt: string;
  updatedAt: string;
}

// Request/Response interfaces
export interface InitiateBookingRequest {
  meetingType: MeetingType;
  issueDescription: string;
  usePreviousCounselor?: boolean;
}

export interface InitiateBookingResponse {
  success: boolean;
  meeting: Meeting;
}

export interface ActiveBookingResponse {
  success: boolean;
  booking: Meeting | null;
}

export interface TimeSlotResponse {
  success: boolean;
  availableSlots: string[];
  error: string;
}

export interface CancelBookingRequest {
  meetingId: string;
  cancellationReason: string;
}

export interface CancelBookingResponse {
  success: boolean;
  message: string;
}

export interface SelectTimeRequest {
  meetingId: string;
  meetingDate: string;
  meetingTime: string;
}

export interface SelectTimeResponse {
  success: boolean;
  meeting: Meeting;
}

export interface SessionHistoryItem {
  id: string;
  counselorName: string;
  counselorAvatar?: string;
  counselorRating?: number;
  date: string;
  time: string;
  type: MeetingType;
  status: MeetingStatus;
  issue?: string;
}

export interface ClientSessionHistoryResponse {
  success: boolean;
  history: SessionHistoryItem[];
}

export interface CounselorHistoryItem {
  id: string;
  clientUsername: string;
  clientAvatar?: string;
  clientAge?: number;
  clientMarriageYears?: number;
  date: string;
  time: string;
  type: MeetingType;
  status: MeetingStatus;
  issue?: string;
}

export interface CounselorHistoryResponse {
  success: boolean;
  history: CounselorHistoryItem[];
}

export interface CounselorStatistics {
  totalSessions: number;
  completedSessions: number;
  cancelledSessions: number;
  activeClients: number;
  averageRating: number;
  recentSessions: {
    id: string;
    clientUsername: string;
    date: string;
    type: MeetingType;
  }[];
}

export interface CounselorStatisticsResponse {
  success: boolean;
  statistics: CounselorStatistics;
}

export interface RatingRequest {
  rating: number;
  feedback?: string;
}

export interface RatingResponse {
  success: boolean;
  message: string;
  data: {
    rating: number;
    feedback?: string;
    counselorNewRating: number;
  };
}

export interface RatingStatusResponse {
  success: boolean;
  data: {
    isRated: boolean;
    rating: number | null;
    feedback: string | null;
  };
}

interface FeedbackItem {
  sessionId: string;
  clientUsername: string;
  sessionDate: string;
  sessionTime: string;
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

interface CounselorFeedbackResponse {
  success: boolean;
  data: {
    feedback: FeedbackItem[];
    statistics: FeedbackStatistics;
    pagination: PaginationInfo;
  };
}


// Combined API slice with all endpoints
export const bookingApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Client booking endpoints
    initiateBooking: builder.mutation<InitiateBookingResponse, InitiateBookingRequest>({
      query: (data) => ({
        url: "/initiate",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: ['ActiveBooking'],
    }),

    getActiveBooking: builder.query<ActiveBookingResponse, void>({
      query: () => ({
        url: "/active-booking",
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: ['ActiveBooking'],
    }),

    getAvailableTimeSlots: builder.query<
      TimeSlotResponse,
      { date: string; counselorId: string }
    >({
      query: ({ date, counselorId }) => ({
        url: `/available-slots?date=${date}&counselorId=${counselorId}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    selectMeetingTime: builder.mutation<SelectTimeResponse, SelectTimeRequest>({
      query: (data) => ({
        url: "/select-time",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: ['ActiveBooking'],
    }),

    cancelBooking: builder.mutation<CancelBookingResponse, CancelBookingRequest>({
      query: (data) => ({
        url: "/cancel",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: ['ActiveBooking','MeetingRequests','PendingMeetings'],
    }),

    // Meeting requests endpoints
    getMeetingRequests: builder.query<{ requests: MeetingRequest[], count:number }, void>({
      query: () => ({
        url: "/meetings/requests",
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: ['MeetingRequests'],
    }),

    getMeetingRequestsCount: builder.query<{ count: number }, void>({
      query: () => ({
        url: "/meetings/requests/count",
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: ['MeetingRequests'],
    }),


    assignCounselor: builder.mutation<
      { success: boolean; message: string },
      { meetingId: string; counselorId: string }
    >({
      query: (data) => ({
        url: "/assign-counselor",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: ['MeetingRequests','ActiveBooking','Counselors'],
    }),

    // Counselor endpoints
    getCounselorMeetings: builder.query<{ success: boolean; meetings: CounselorMeeting[] }, void>({
      query: () => ({
        url: "/counselor/meetings",
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: ['CounselorMeetings'],
    }),

    getPendingMeetings: builder.query<{ success: boolean; meetings: CounselorMeeting[] }, void>({
      query: () => ({
        url: "/counselor/pending",
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: ['PendingMeetings'],
    }),

    acceptMeeting: builder.mutation<{ success: boolean; message: string }, { meetingId: string }>({
      query: (data) => ({
        url: "/accept",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: ['CounselorMeetings', 'PendingMeetings'],
    }),

    cancelCounselorMeeting: builder.mutation<
      { success: boolean; message: string },
      { meetingId: string; cancellationReason: string }
    >({
      query: (data) => ({
        url: "/cancel",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: ['CounselorMeetings', 'PendingMeetings'],
    }),
    getCounselorActiveSession: builder.query<CounselorActiveSessionResponse, void>({
      query: () => ({
        url: "/counselor/active-session",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    getClientSessionHistory: builder.query<ClientSessionHistoryResponse, void>({
      query: () => ({
        url: '/client/history',
        method: 'GET',
        credentials: "include" as const,
      }),
    }),
    getCounselorSessionHistory: builder.query<CounselorHistoryResponse, void>({
      query: () => ({
        url: '/counselor/history',
        method: 'GET',
        credentials: "include" as const,
      }),
    }),

    getCounselorStatistics: builder.query<CounselorStatisticsResponse, void>({
      query: () => ({
        url: '/counselor/statistics',
        method: 'GET',
        credentials: "include" as const,
      }),
    }),
    rateSession: builder.mutation<RatingResponse, { meetingId: string; data: RatingRequest }>({
      query: ({ meetingId, data }) => ({
        url: `/rate/${meetingId}`,
        method: 'POST',
        body: data,
        credentials: 'include' as const,
      }),
    }),

    getSessionRatingStatus: builder.query<RatingStatusResponse, string>({
      query: (meetingId) => ({
        url: `/rate/status/${meetingId}`,
        method: 'GET',
        credentials: 'include' as const,
      }),
    }),
    getCounselorFeedback: builder.query<
    CounselorFeedbackResponse,
    { page?: number; limit?: number; sortBy?: string; order?: 'asc' | 'desc' }
  >({
    query: (params = {}) => ({
      url: '/counselor/feedback',
      method: 'GET',
      params,
      credentials: 'include' as const,
    }),
  }),
  }),
});

export const {
  // Client booking hooks
  useInitiateBookingMutation,
  useGetActiveBookingQuery,
  useGetAvailableTimeSlotsQuery,
  useSelectMeetingTimeMutation,
  useCancelBookingMutation,
  // Meeting requests hooks
  useGetMeetingRequestsQuery,
  useGetMeetingRequestsCountQuery,
  useAssignCounselorMutation,
  // Counselor hooks
  useGetCounselorMeetingsQuery,
  useGetPendingMeetingsQuery,
  useAcceptMeetingMutation,
  useCancelCounselorMeetingMutation,
  useGetCounselorActiveSessionQuery,

  //session hooks
  useGetClientSessionHistoryQuery,
  useGetCounselorSessionHistoryQuery,
  useGetCounselorStatisticsQuery,
  useRateSessionMutation,
  useGetSessionRatingStatusQuery,
  useGetCounselorFeedbackQuery,
} = bookingApi;