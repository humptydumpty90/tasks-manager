import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URL } from './base';
import type { ISignUpResponse, ISignInResponse, IGetMeResponse } from '../../interfaces';
import type { IAuth } from '../../interfaces/auth';

const BASE_URL = `${API_URL}/auth`;

export const API_NAME = 'authApi';

export const authApi = createApi({
  reducerPath: API_NAME,
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: 'include',
  }),
  endpoints: build => ({
    signUp: build.mutation<ISignUpResponse, IAuth>({
      query: (body: IAuth) => ({
        url: 'sign-up',
        method: 'POST',
        body,
      }),
    }),
    signIn: build.mutation<ISignInResponse, Omit<IAuth, 'name'>>({
      query: (body: Omit<IAuth, 'name'>) => ({
        url: 'sign-in',
        method: 'POST',
        body,
      }),
    }),
    signOut: build.mutation<void, void>({
      query: () => ({
        url: 'sign-out',
        method: 'POST',
      }),
    }),
    me: build.query<IGetMeResponse, void>({
      query: () => ({
        url: 'me',
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useSignUpMutation,
  useSignInMutation,
  useSignOutMutation,
  useMeQuery,
} = authApi;

export { API_NAME as AUTH_API_NAME };
