import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { userLoggedIn, userLoggedOut } from "../auth/authSlice";
import { IUser } from "@/redux/types/auth";

interface RefreshResponse {
    success: boolean;
    accessToken: string;
    user: IUser;
}

export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_SERVER_URL,
    }),
    tagTypes: [
        'User',
        'Notification',
        'Counselors',
        'Avatar',
        'MeetingRequests',
        'ActiveBooking',
        'CounselorMeetings',
        'PendingMeetings',
        'AdminMeetings',
        'AdminAnalytics',
        'AdminSessions',
        'AdminFeedback',
    ],
    endpoints: (builder) => ({
        refreshToken: builder.query({
            query:(data) => ({
                url:"refresh",
                method:"GET",
                credentials:"include" as const,
            })
        }),
        loadUser: builder.query<RefreshResponse, void>({
            query: () => ({
                url: "me",
                method: "GET",
                credentials:"include" as const,
            }),
            providesTags: ['User'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(userLoggedIn({ 
                        accessToken: data.accessToken,
                        user: data.user,
                    }));
                } catch (error) {
                    console.error("Load user failed:", error);
                }
            },
        }),
    }),
});

export const { useLoadUserQuery } = apiSlice;