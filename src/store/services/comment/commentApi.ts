// libraries
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// config
import { BASE_URL } from 'store/services/config';
// types

export interface Comment {
  id: string;
  taskId: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface AddCommentRequest {
  taskId: string;
  text: string;
  author: string;
}

export const commentsApi = createApi({
  reducerPath: 'commentsApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ['Comment'],
  endpoints: (builder) => ({
    getCommentsByTaskId: builder.query<Comment[], string>({
      query: (taskId) => `/comments?taskId=${taskId}`,
      providesTags: (result, error, taskId) => [{ type: 'Comment', id: taskId }],
    }),
    addComment: builder.mutation<Comment, AddCommentRequest>({
      query: (commentData) => ({
        url: '/comments',
        method: 'POST',
        body: commentData,
      }),
      invalidatesTags: (result, error, { taskId }) => [{ type: 'Comment', id: `TASK_${taskId}` }],
    }),
  }),
});

export const {
  useGetCommentsByTaskIdQuery,
  useAddCommentMutation,
} = commentsApi;
