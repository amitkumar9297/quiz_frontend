import { createApi, fetchBaseQuery, BaseQueryFn, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { Mutex } from "async-mutex";
import { logout,setTokens } from "../store/reducers/authReducer";

interface User {
  id: string;
  name: string;
  email: string;
}

interface SignupPayload {
  name: string;
  email: string;
  password: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  token: {
    accessToken: string;
    refreshToken: string;
    userId: string;
  };
}

interface ForgotPasswordPayload {
  email: string;
}

interface ResetPasswordPayload {
  email: string;
  token: string;
  newPassword: string;
}

interface RefreshTokenPayload {
  refreshToken: string;
}

interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}



const BASE_URL = `${import.meta.env.VITE_BASE_URL}/`;

const mutex = new Mutex();

/**
 * A custom base query that handles 401 Unauthorized responses by attempting to
 * refresh the access token using the refresh token stored in the Redux state.
 *
 * If the refresh token is valid, the function will retry the original query with
 * the new access token. If the refresh token is invalid, the function will log out
 * the user by dispatching the `logout` action.
 *
 * This function uses a mutex to prevent multiple concurrent refresh requests.
 *
 * @param args The query arguments passed to `fetchBaseQuery`.
 * @param api The RTK Query API object.
 * @param extraOptions Additional options passed to `fetchBaseQuery`.
 * @returns The result of the query, or an error if the refresh token is invalid.
 */
export const baseQueryWithReauth: BaseQueryFn = async (args, api, extraOptions) => {
  const baseQuery = fetchBaseQuery({ baseUrl: BASE_URL });
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Acquire the mutex to prevent multiple refresh requests
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        // Attempt to refresh the token
        const state: any = api.getState();
        const refreshToken = state.auth.refreshToken;

        if (refreshToken) {
          const refreshResult = await baseQuery(
            {
              url: "users/refresh-token",
              method: "POST",
              body: { refreshToken },
            },
            api,
            extraOptions
          );

          if (refreshResult.data) {
            const { accessToken, refreshToken: newRefreshToken } = refreshResult.data as RefreshTokenResponse;

            // Save the new tokens to the Redux state
            api.dispatch(
              setTokens({
                accessToken,
                refreshToken: newRefreshToken,
              })
            );

            // Retry the original query
            result = await baseQuery(args, api, extraOptions);
          } else {
            api.dispatch(logout());
          }
        } else {
          api.dispatch(logout());
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



export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth, // Update base URL
  endpoints: (builder) => ({
    getUserById: builder.query<User, string>({
      query: (id) => `users/${id}`,
    }),
    signupUser: builder.mutation<void, SignupPayload>({
      query: (data) => ({
        url: "users",
        method: "POST",
        body: data,
      }),
    }),
    loginUser: builder.mutation<LoginResponse, LoginPayload>({
      query: (data) => ({
        url: "users/login",
        method: "POST",
        body: data,
      }),
    }),
     // Forgot Password API
     forgotPassword: builder.mutation<void, ForgotPasswordPayload>({
      query: (data) => ({
        url: "users/forgot-password",
        method: "POST",
        body: data,
      }),
    }),

    // Reset Password API
    resetPassword: builder.mutation<void, ResetPasswordPayload>({
      query: (data) => ({
        url: "users/reset-password",
        method: "POST",
        body: data,
      }),
    }),

    // Refresh Token API
    refreshToken: builder.mutation<RefreshTokenResponse, RefreshTokenPayload>({
      query: (data) => ({
        url: "users/refresh-token",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { 
  useGetUserByIdQuery, 
  useSignupUserMutation,
  useLoginUserMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useRefreshTokenMutation,
} = api;
