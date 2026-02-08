// src/routes/public/public.routes.ts
import { RouteObject } from 'react-router-dom';
import { PublicLayout } from '../../layouts/public/PublicLayout';

export const PublicRoutes: RouteObject[] = [
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <div>Home Page</div>, // placeholder
      },
      {
        path: 'search',
        element: <div>Search Page</div>,
      },
    ],
  },
];
