// src/routes/errors/error.routes.ts
import { RouteObject } from 'react-router-dom';
import { ErrorLayout } from '../../layouts/shared/ErrorLayout';

export const ErrorRoutes: RouteObject[] = [
  {
    path: '*',
    element: <ErrorLayout />,
  },
];
