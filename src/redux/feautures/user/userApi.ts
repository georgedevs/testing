import { apiSlice } from "../api/apiSlice";

export interface UpdateClientProfileData {
  username?: string;
  marriageYears?: number;
  age?: number;
  issuesExperienced?: string[];
  preferredCounselorGender?: "male" | "female" | "no_preference";
  preferredLanguages?: string[];
  timezone?: string;
}

export interface UpdateCounselorProfileData {
  fullName?: string;
  specializations?: string[];
  marriageYears?: number;
  preferredAgeGroups?: string[];
  gender?: "male" | "female";
  languages?: string[];
  availability?: Array<{
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isRecurring: boolean;
  }>;
  unavailableDates?: Date[];
  maxDailyMeetings?: number;
  isAvailable?: boolean;
  workingHours?: {
    start: string;
    end: string;
    timezone: string;
  };
  meetingPreferences?: {
    maxConsecutiveMeetings: number;
  };
}

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateClientProfile: builder.mutation<
      { success: boolean; client: any },
      UpdateClientProfileData
    >({
      query: (data) => ({
        url: "update-client-profile",
        method: "PUT",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: ["User"],
    }),
    updateCounselorProfile: builder.mutation<
      { success: boolean; counselor: any },
      UpdateCounselorProfileData
    >({
      query: (data) => ({
        url: "update-counselor-profile",
        method: "PUT",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const { useUpdateClientProfileMutation, useUpdateCounselorProfileMutation } = userApi;
