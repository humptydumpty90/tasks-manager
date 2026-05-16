import { createBrowserRouter, redirect } from 'react-router'
import { authRoutes } from './auth'
import { dashboardRoutes } from './dashboar'
import { ProtectedRoute } from '../components/protected-route'

export const routes = createBrowserRouter([
  authRoutes,
  {
    Component: ProtectedRoute,
    children: [dashboardRoutes],
  },
  {
    path: '*',
    middleware: [
      () => {
        return redirect('/')
      },
    ],
  },
])
