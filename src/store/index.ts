import { configureStore } from '@reduxjs/toolkit';

import { commentsApi } from 'store/services/comment/commentApi';
import { projectsApi } from 'store/services/project/projectApi';
import { taskApi } from 'store/services/task/taskApi';
import { userApi } from 'store/services/user/userApi';

export const store = configureStore({
  reducer: {
    [projectsApi.reducerPath]: projectsApi.reducer,
    [taskApi.reducerPath]: taskApi.reducer,
    [commentsApi.reducerPath]: commentsApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(projectsApi.middleware, taskApi.middleware, commentsApi.middleware, userApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
