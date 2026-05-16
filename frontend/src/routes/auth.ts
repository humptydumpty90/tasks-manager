import { redirect } from 'react-router';
import { AuthLayout } from '../layouts';
import { SignInPage, SignUpPage } from '../pages';
import store from '../store';
import { authApi } from '../store/api';

export const authRoutes = {
  path: '/auth',
  Component: AuthLayout,
  children: [
    {
      index: true,
      middleware: [() => {
        return redirect('/auth/sign-in');
      }],
    },
    {
      path: 'sign-in',
      Component: SignInPage,
    },
    {
      path: 'sign-up',
      Component: SignUpPage,
    },
  ],
};

export async function authMiddleware() {
  try {
    await store
      .dispatch(authApi.endpoints.me.initiate())
      .unwrap();

    return null;
  }
  catch (_: any) {
    throw redirect('/auth/sign-in');
  }
}
