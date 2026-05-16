import { Navigate, Outlet } from 'react-router';
import { useMeQuery } from '../../store/api';
import { Loading } from '../loading';

export const ProtectedRoute = () => {
  const { isSuccess, isError, isLoading } = useMeQuery();

  if (isLoading) {
    return <Loading />;
  }

  if (isError || !isSuccess) {
    console.log('User is not authenticated');

    return <Navigate to="auth/sign-in" />;
  }

  return <Outlet />;
};
