import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

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

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api/" }), // Update base URL
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
  }),
});

export const { useGetUserByIdQuery, useSignupUserMutation,useLoginUserMutation } = api;
