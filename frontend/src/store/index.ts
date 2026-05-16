import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './api/auth';
import { boardsApi, tasksApi } from './api';

const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [boardsApi.reducerPath]: boardsApi.reducer,
    [tasksApi.reducerPath]: tasksApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(authApi.middleware, boardsApi.middleware, tasksApi.middleware),
});
export type RootState = ReturnType<typeof store.getState>;

export default store;
