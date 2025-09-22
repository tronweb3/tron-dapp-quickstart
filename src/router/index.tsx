import { lazy } from 'react';
import { createBrowserRouter, redirect, RouterProvider } from 'react-router-dom';

import type { RouteObject } from 'react-router-dom';

const Index = lazy(() => import('../pages/Index/Index'));
const Delegate = lazy(() => import('../pages/Delegate/Delegate'));

const routes: RouteObject[] = [
  {
    path: '/',
    loader: () => redirect('/transfer'),
  },
  {
    path: '/transfer',
    element: <Index />,
  },
  {
    path: '/delegate',
    element: <Delegate />,
  },
];

const router = createBrowserRouter(routes);

const Routes = () => {
  return <RouterProvider router={router} />;
};

export default Routes;
