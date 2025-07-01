// libraries
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// config
import { BASE_URL } from 'store/services/config';

export const fileApi = createApi({
  reducerPath: 'fileApi',
  baseURL: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ['File'],
});
