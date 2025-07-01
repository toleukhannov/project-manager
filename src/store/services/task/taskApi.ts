// libraries
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// config
import { BASE_URL } from 'store/services/config';
// types
import type { TaskFormInputProps } from 'components/LoginPage/types';

export interface Task {
  id: string;
  projectId: string;
  description: string;
  title: string;
  status: string;
  deadline: string;
  assignee: string;
}

export const taskApi = createApi({
  reducerPath: 'tasks',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ['Task'],
  endpoints: (builder) => ({
    getTasksByProjectId: builder.query<Task[], string>({
      query: (projectId) => `/tasks?projectId=${projectId}`,
      providesTags: (result, error, projectId) => [{ type: 'Task', id: projectId }],
    }),

    addTask: builder.mutation<Task, TaskFormInputProps>({
      query: (data) => ({
        url: '/tasks',
        method: 'POST',
        body: {
          ...data,
        },
      }),
      invalidatesTags: (result, error, data) => [{ type: 'Task', id: data.projectId }],
    }),

    updateTask: builder.mutation<Task, Task>({
      query: ({ id, ...patch }) => ({
        url: `/tasks/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (result, error, task) => [{ type: 'Task', id: task.projectId }],
    }),

    getTaskById: builder.query<Task, string>({
      query: (id) => `/tasks/${id}`,
      providesTags: (result, error, id) => [{ type: 'Task', id }],
    }),

    deleteTask: builder.mutation<void, { taskId: string }>({
      query: ({ taskId }) => ({
        url: `/tasks/${taskId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { taskId }) => [{ type: 'Task', id: taskId }],
    }),

    getTasksByUserId: builder.query<Task[], string>({
      query: (userId) => `/tasks?assignee=${userId}`,
      providesTags: (result, error, userId) => [{ type: 'Task', id: `user-${userId}` }],
    }),
  }),
});

export const {
  useGetTasksByProjectIdQuery,
  useGetTaskByIdQuery,
  useAddTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useGetTasksByUserIdQuery,
} = taskApi;
