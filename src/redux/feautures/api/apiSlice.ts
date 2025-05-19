import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { userLoggedIn, userLoggedOut, setLoading } from "../auth/authSlice";
import { Mutex } from 'async-mutex';
import { IUser } from "@/redux/types/auth";

interface UserResponse {
  success: boolean;
  user: IUser;
}

const mutex = new Mutex();

// Base query with credentials
const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_SERVER_URL,
  credentials: 'include', 
  prepareHeaders: (headers) => {
    // No Authorization header needed with cookie-based auth
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();
  
  // Determine if this is an authentication check endpoint
  const isMeEndpoint = typeof args === 'string' 
      ? args === 'me'
      : args.url === 'me';
  
  let result = await baseQuery(args, api, extraOptions);

  // Handle 401 errors - not authenticated
  if (result.error && result.error.status === 401) {
    // Only log 401 errors if they're not from the /me endpoint
    if (!isMeEndpoint) {
      console.debug('Authentication required');
    }
    
    // No need for refresh token logic - the server will handle session expiration
    // Just dispatch logout action to update UI
    api.dispatch(userLoggedOut());
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
      }),
      providesTags: ['User'],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        // Set loading state to true when starting the request
        dispatch(setLoading(true));
        
        try {
          const { data } = await queryFulfilled;
          
          if (data.success && data.user) {
            dispatch(userLoggedIn({ 
              user: data.user,
            }));
          }
        } catch (error: any) {
          // Set loading to false in case of error
          dispatch(setLoading(false));

          if (error?.status !== 401) {
            console.error("Unexpected Error During Auth Check", error);
          }
        }
      },
    }),
  }),
});

export const { useLoadUserQuery } = apiSlice;