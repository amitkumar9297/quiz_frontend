import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const quizzesApi = createApi({
  reducerPath: 'quizzesApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000/api/' }),
  endpoints: (builder) => ({
    fetchQuizzes: builder.query({
      query: () => 'quizzes/',
    }),
  }),
});

export const { useFetchQuizzesQuery } = quizzesApi;
