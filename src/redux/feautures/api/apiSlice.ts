// src/redux/features/api/apiSlice.ts
import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { userLoggedIn, userLoggedOut } from "../auth/authSlice";
import { Mutex } from 'async-mutex';
import { IUser } from "@/redux/types/auth";
import { tokenService } from "@/utils/tokenService";

interface RefreshResponse {
    success: boolean;
    accessToken: string;
    user: IUser;
}

const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_SERVER_URL,
    credentials: 'include',
    prepareHeaders: (headers) => {
        const token = tokenService.getToken();
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
    await mutex.waitForUnlock();
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        if (!mutex.isLocked()) {
            const release = await mutex.acquire();

            try {
                const refreshResult = await baseQuery(
                    { 
                        url: 'refresh',
                        method: 'GET'
                    },
                    api,
                    extraOptions
                ) as { data: RefreshResponse };

                if (refreshResult.data?.success) {
                    // Store new token
                    tokenService.setToken(refreshResult.data.accessToken);
                    api.dispatch(userLoggedIn({
                        accessToken: refreshResult.data.accessToken,
                        user: refreshResult.data.user
                    }));
                    // Retry the initial query
                    result = await baseQuery(args, api, extraOptions);
                } else {
                    tokenService.removeToken();
                    api.dispatch(userLoggedOut());
                }
            } finally {
                release();
            }
        } else {
            await mutex.waitForUnlock();
            result = await baseQuery(args, api, extraOptions);
        }
    }

    return result;
};

export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: baseQueryWithReauth,
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
        loadUser: builder.query<RefreshResponse, void>({
            query: () => ({
                url: "me",
                method: "GET",
            }),
            providesTags: ['User'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    tokenService.setToken(data.accessToken);
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