import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { userLoggedIn, userLoggedOut } from "../auth/authSlice";
import { Mutex } from 'async-mutex';
import { IUser } from "@/redux/types/auth";

interface RefreshResponse {
    success: boolean;
    accessToken: string;
    user: IUser;
}

// Create a mutex to prevent multiple refresh token calls
const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_SERVER_URL,
    credentials: 'include',
    prepareHeaders: (headers) => {
      headers.set('Accept', 'application/json');
      headers.set('Cache-Control', 'no-cache');
      return headers;
    },
  });

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
    // Wait until the mutex is available without locking it
    await mutex.waitForUnlock();
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        // Checking whether the mutex is locked
        if (!mutex.isLocked()) {
            const release = await mutex.acquire();

            try {
                // Try to get a new token
                const refreshResult = await baseQuery(
                    { 
                        url: 'refresh',
                        method: 'GET'
                    },
                    api,
                    extraOptions
                ) as { data: RefreshResponse };

                if (refreshResult.data?.success) {
                    // Store the new token
                    api.dispatch(userLoggedIn({
                        accessToken: refreshResult.data.accessToken,
                        user: refreshResult.data.user
                    }));
                    // Retry the initial query
                    result = await baseQuery(args, api, extraOptions);
                } else {
                    api.dispatch(userLoggedOut());
                }
            } finally {
                // Release must be called once the mutex should be released again.
                release();
            }
        } else {
            // Wait until the mutex is available without locking it
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