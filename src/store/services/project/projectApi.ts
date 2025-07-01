// libraries
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// config
import { BASE_URL } from 'store/services/config';
// types
import type { ProjectFormInputProps } from 'components/LoginPage/types';

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export const projectsApi = createApi({
  reducerPath: 'projectsApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ['Project'],
  endpoints: (builder) => ({
    getProjects: builder.query<Project[], void>({
      query: () => '/projects',
      providesTags: ['Project'],
    }),

    getProjectById: builder.query<Project, string>({
      query: (id) => `/projects/${id}`,
      providesTags: (result, error, id) => [{ type: 'Project', id }],
    }),

    createProject: builder.mutation<Project, ProjectFormInputProps>({
      query: (data) => ({
        url: '/projects',
        method: 'POST',
        body: {
          ...data,
          createdAt: new Date().toISOString(),
        },
      }),
      invalidatesTags: ['Project'],
    }),

    deleteProject: builder.mutation<void, string>({
      query: (id) => ({
        url: `/projects/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Project'],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetProjectByIdQuery,
  useCreateProjectMutation,
  useDeleteProjectMutation,
} = projectsApi;
