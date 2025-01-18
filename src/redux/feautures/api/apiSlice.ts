import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { userLoggedIn, userLoggedOut } from "../auth/authSlice";
import { Mutex } from 'async-mutex';
import { IUser } from "@/redux/types/auth";
import { tokenService } from "@/utils/tokenService";

interface RefreshResponse {
    success: boolean;
    accessToken: string;
    user: IUser;
    refreshToken:string;
}

const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_SERVER_URL,
    prepareHeaders: (headers) => {
        const token = tokenService.getAccessToken();
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
                const refreshToken = tokenService.getRefreshToken();
                if (!refreshToken) {
                    tokenService.clearTokens();
                    api.dispatch(userLoggedOut());
                    return result;
                }

                const refreshResult = await baseQuery(
                    {
                        url: 'refresh',
                        method: 'POST',
                        body: { refreshToken }
                    },
                    api,
                    extraOptions
                );

                if (refreshResult.data) {
                    const { accessToken, refreshToken } = refreshResult.data as any;
                    tokenService.setTokens(accessToken, refreshToken);
                    // Retry the original query with new access token
                    result = await baseQuery(args, api, extraOptions);
                } else {
                    tokenService.clearTokens();
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
                    
                    // If the backend sends both tokens in the /me response
                    if (data.accessToken && data.refreshToken) {
                        dispatch(userLoggedIn({ 
                            accessToken: data.accessToken,
                            refreshToken: data.refreshToken,
                            user: data.user,
                        }));
                    } else {
                        // If you only get user data without tokens
                        const currentAccessToken = tokenService.getAccessToken();
                        const currentRefreshToken = tokenService.getRefreshToken();
                        
                        if (currentAccessToken && currentRefreshToken) {
                            dispatch(userLoggedIn({ 
                                accessToken: currentAccessToken,
                                refreshToken: currentRefreshToken,
                                user: data.user,
                            }));
                        }
                    }
                } catch (error) {
                    console.error("Load user failed:", error);
                }
            },
        }),
    }),
});
export const { useLoadUserQuery } = apiSlice;