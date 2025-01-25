import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Quiz {
  _id: string;
  title: string;
  description: string;
  duration: number;
  questions: {
    _id: string;
    questionText: string;
    options: string[];
    correctOption: string;
  }[];
}


export interface QuizAttemptResponse {
  success: boolean;
  data: any; 
}



export const quizzesApi = createApi({
  reducerPath: 'quizzesApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000/api/' }),
  endpoints: (builder) => ({
    getQuizzes: builder.query<Quiz[], void>({
      query: () => '/quizzes/',
    }),
    getQuizById: builder.query<Quiz, string>({
      query: (quizId) => `/quizzes/${quizId}`,
    }),
    startQuiz: builder.mutation<QuizAttemptResponse, { userId: string; quizId: string; token: string }>({
      query: ({ userId, quizId, token }) => ({
        url: '/quiz-attempts/',
        method: 'POST',
        body: { userId, quizId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),



  }),
});

export const { useGetQuizzesQuery, useGetQuizByIdQuery, useStartQuizMutation } = quizzesApi;
