import { RouterProvider } from 'react-router';
import { routes } from './routes';

import './App.scss';

export function App() {
  return (
    <RouterProvider router={ routes } />
  );
};
