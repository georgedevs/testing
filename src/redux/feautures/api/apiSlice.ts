// src/redux/features/api/apiSlice.ts
import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { userLoggedIn, userLoggedOut, setLoading } from "../auth/authSlice";
import { Mutex } from 'async-mutex';
import { IUser } from "@/redux/types/auth";

interface UserResponse {
    success: boolean;
    user: IUser;
}

const mutex = new Mutex();

// Custom fetch implementation that suppresses 401 errors for /me endpoint
const customFetch: typeof fetch = async (input, init) => {
    // Check if this is a request to the /me endpoint
    const url = input instanceof Request ? input.url : input.toString();
    const isMeEndpoint = url.endsWith('/me');

    // For /me endpoint, use a custom fetch with error handling
    if (isMeEndpoint) {
        try {
            // Make the request using the original fetch
            const response = await fetch(input, init);
            
            // If it's a 401, create a cloned successful response to prevent browser logging
            if (response.status === 401) {
                // Return a fake "successful" response that our code will handle
                return new Response(JSON.stringify({ 
                    success: false, 
                    silentAuthFailure: true 
                }), {
                    status: 200, // Fake 200 status to prevent browser console error
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            }
            
            return response;
        } catch (error) {
            // For network errors, also return a fake response
            return new Response(JSON.stringify({ 
                success: false, 
                silentAuthFailure: true,
                networkError: true
            }), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    }
    
    // For all other endpoints, use the regular fetch
    return fetch(input, init);
};

// Modified baseQuery that uses our custom fetch and includes credentials for cookies
const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_SERVER_URL,
    credentials: 'include', // Important for cookies
    fetchFn: customFetch // Use our custom fetch implementation
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
    await mutex.waitForUnlock();
    
    // Determine if this is an authentication check endpoint
    const isMeEndpoint = typeof args === 'string' 
        ? args === 'me'
        : args.url === 'me';
    
    let result = await baseQuery(args, api, extraOptions);

    // Check for our special silent auth failure response
    if (result.data && (result.data as any).silentAuthFailure) {
        // Convert this back to a proper error
        return {
            error: {
                status: 401,
                data: { message: 'Not authenticated' }
            }
        };
    }

    // Handle 401 errors - token expired or invalid
    if (result.error && result.error.status === 401) {
        // Only log 401 errors if they're not from the /me endpoint
        if (!isMeEndpoint) {
            console.debug('Authentication required - attempting token refresh');
        }
        
        if (!mutex.isLocked()) {
            const release = await mutex.acquire();

            try {
                // Call the refresh endpoint, cookies will be included automatically
                const refreshResult = await baseQuery(
                    {
                        url: 'refresh',
                        method: 'POST',
                        credentials: 'include' // Make sure cookies are included
                    },
                    api,
                    extraOptions
                );

                const data = refreshResult.data as UserResponse;
                
                if (data?.success) {
                    // Update auth state with new user data
                    api.dispatch(
                        userLoggedIn({
                            user: data.user,
                        })
                    );

                    // Retry the original query with new access token in cookie
                    result = await baseQuery(args, api, extraOptions);
                } else {
                    // Silently handle expected auth failures
                    if (!isMeEndpoint) {
                        console.debug('Token refresh failed - logging out user');
                    }
                    api.dispatch(userLoggedOut());
                }
            } catch (error) {
                // Only log unexpected refresh errors
                if (!isMeEndpoint) {
                    console.error('Token refresh failed:', error);
                }
                api.dispatch(userLoggedOut());
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
        loadUser: builder.query<UserResponse, void>({
            query: () => ({
                url: "me",
                method: "GET",
                credentials: "include", // Important for cookies
            }),
            providesTags: ['User'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                // Set loading state to true when starting the request
                dispatch(setLoading(true));
                
                try {
                    const { data } = await queryFulfilled;
                    
                    if (data.success) {
                        dispatch(userLoggedIn({ 
                            user: data.user,
                        }));
                    }
                } catch (error:any) {
                    // Set loading to false in case of error
                    dispatch(setLoading(false));

                    if(error?.status !== 401){
                        console.error("Unexpected Error During Auth Check", error);
                    }
                }
            },
        }),
    }),
});

export const { useLoadUserQuery } = apiSlice;