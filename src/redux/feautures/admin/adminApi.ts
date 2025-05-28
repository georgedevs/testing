// src/redux/feautures/admin/adminApi.ts - Updated with activeOnly filter

import { apiSlice } from "../api/apiSlice";

interface CounselorStatistics {
  totalCounselors: number;
  activeCounselors: number;
  inactiveCounselors: number;
  pendingCounselors: number;
  averageRating: number;
  totalCompletedSessions: number;
}

interface Counselor {
  _id: string;
  fullName: string;
  email: string;
  isActive: boolean;
  isAvailable?: boolean;
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
  activeOnly?: boolean;
}

export const adminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllCounselors: builder.query<GetCounselorsResponse, CounselorFilters | void>({
      query: (filters) => {
        // Ensure filters is always an object
        const filterObj = filters || {};
        
        // Convert filters to URL parameters
        const params = new URLSearchParams();
        
        Object.entries(filterObj).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, String(value));
          }
        });

        return {
          url: `admin/counselors?${params.toString()}`,
          method: 'GET',
          credentials: 'include' as const,
        };
      },
      providesTags: ['Counselors'],
    }),
    
    getActiveCounselors: builder.query<GetCounselorsResponse, void>({
      query: () => ({
        url: 'admin/counselors?activeOnly=true',
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
  useGetActiveCounselorsQuery, 
  useDeleteCounselorMutation
} = adminApi;