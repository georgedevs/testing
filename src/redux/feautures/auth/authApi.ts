import { IUser } from "@/redux/types/auth";
import { apiSlice } from "../api/apiSlice";
import { userLoggedIn, userLoggedOut, userRegistration } from "./authSlice";
import { AvatarResponse, UpdateAvatarResponse } from "@/types/avatar";

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  user: IUser;
  accessToken: string;
}

type RegistrationData = {
  email:string;
  password:string;
  fullName?:string;
  gender?:string;
  role?:string;
  registrationToken?:string;
};

type RegistrationResponse = {
  message: string;
  activationToken: string;
};

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<RegistrationResponse, RegistrationData>({
      query: (data) => ({
        url: "registration",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          dispatch(userRegistration({ token: result.data.activationToken }));
        } catch (error) {}
      },
    }),
    activation: builder.mutation({
      query: ({ activation_token, activation_code }) => ({
        url: "activation",
        method: "POST",
        body: {
          activation_token,
          activation_code,
        },
        credentials: "include" as const,
      }),
    }),
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "login",
        method: "POST",
        body: credentials,
        credentials: "include" as const,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userLoggedIn({
              accessToken: result.data.accessToken,
              user: result.data.user,
            })
          );
        } catch (error: any) {
          console.error("Login error:", error);
        }
      },
    }),
    logout: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        url: "logout",
        method: "POST",
        credentials: "include" as const,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(apiSlice.util.resetApiState());
          dispatch(userLoggedOut());
        } catch (error) {
          console.error("Logout error:", error);
        }
      },
    }),
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: "forgot-password",
        method: "POST",
        body: { email },
      }),
    }),
    generateCounselorLink: builder.mutation({
      query: (data) => ({
        url: 'generate-counselor-link',
        method: 'POST',
        body: data,
        credentials: 'include',
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ resetToken, newPassword }) => ({
        url: "reset-password",
        method: "POST",
        body: {
          resetToken,
          newPassword,
        },
      }),
    }),
    getPendingCounselors: builder.query<{ success: boolean; count: number; counselors: any[] }, void>({
      query: () => ({
        url: 'admin/pending-counselors',
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['Counselors'],
    }),
    
    approveCounselor: builder.mutation({
      query: (counselorId) => ({
        url: `admin/counselors/${counselorId}/approve`,
        method: 'PUT',
        credentials: 'include',
      }),
      invalidatesTags: ['Counselors'],
    }),
    
    rejectCounselor: builder.mutation({
      query: ({ counselorId, reason }) => ({
        url: `admin/counselors/${counselorId}/reject`,
        method: 'DELETE',
        body: { reason },
        credentials: 'include',
      }),
      invalidatesTags: ['Counselors'],
    }),
    getAvatars: builder.query<AvatarResponse, void>({
      query: () => 'avatars',
      providesTags: ['Avatar'],
    }),
    updateAvatar: builder.mutation<UpdateAvatarResponse, string>({
      query: (avatarId) => ({
        url: 'update-avatar', 
        method: 'POST',
        body: { avatarId },
        credentials:'include'
      }),
      invalidatesTags: ['Avatar'],
    }),
    updatePassword: builder.mutation<{ success: boolean; message: string }, { oldPassword: string; newPassword: string }>({
      query: (passwords) => ({
        url: "update-password",
        method: "PUT",
        body: passwords,
        credentials: "include" as const,
      }),
      invalidatesTags: ['User'],
    }),
    deleteAccount: builder.mutation<{ success: boolean; message: string }, { password: string }>({
      query: (data) => ({
        url: "delete-account",
        method: "DELETE",
        body: data,
        credentials: "include" as const,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(apiSlice.util.resetApiState());
          dispatch(userLoggedOut());
        } catch (error) {
          console.error("Delete account error:", error);
        }
      },
    }),
  }),
});

export const {
  useRegisterMutation,
  useActivationMutation,
  useLoginMutation,
  useForgotPasswordMutation,
  useLogoutMutation,
  useResetPasswordMutation,
  useGenerateCounselorLinkMutation,
  useApproveCounselorMutation,
  useGetPendingCounselorsQuery,
  useRejectCounselorMutation,
  useGetAvatarsQuery,
  useUpdateAvatarMutation,
  useUpdatePasswordMutation,
  useDeleteAccountMutation
} = authApi;