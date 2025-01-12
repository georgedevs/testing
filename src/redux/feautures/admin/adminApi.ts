import { apiSlice } from "../api/apiSlice";

interface CounselorStatistics {
  totalCounselors: number;
  activeCounselors: number;
  averageRating: number;
  totalCompletedSessions: number;
}

interface Counselor {
  _id: string;
  fullName: string;
  email: string;
  isActive: boolean;
  specializations: string[];
  languages: string[];
  gender: string;
  rating: number;
  totalSessions: number;
  completedSessions: number;
  activeClients: number;
  credentials?: string;
  createdAt: string;
}

interface GetCounselorsResponse {
  success: boolean;
  statistics: CounselorStatistics;
  counselors: Counselor[];
  count: number;
}

interface CounselorFilters {
  isActive?: boolean;
  specialization?: string;
  language?: string;
  gender?: string;
  minRating?: number;
  maxClients?: number;
}

export const adminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllCounselors: builder.query<GetCounselorsResponse, CounselorFilters | void>({
      query: (filters) => ({
        url: 'admin/counselors',
        method: 'GET',
        credentials: 'include' as const,
      }),
      providesTags: ['Counselors'],
    }),
    deleteCounselor: builder.mutation<
      { success: boolean; message: string },
      { counselorId: string; reason?: string }
    >({
      query: ({ counselorId, reason }) => ({
        url: `admin/counselors/${counselorId}/delete`,
        method: "DELETE",
        body: { reason },
        credentials: "include" as const,
      }),
      invalidatesTags: ["Counselors"],
    }),
  }),
});

export const {
  useGetAllCounselorsQuery,
  useDeleteCounselorMutation
} = adminApi;