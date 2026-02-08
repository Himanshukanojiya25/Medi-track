// src/routes/auth/auth.routes.ts
import { RouteObject } from 'react-router-dom';
import { AuthLayout } from '../../layouts/auth/AuthLayout';

export const AuthRoutes: RouteObject[] = [
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <div>Login</div> },
      { path: 'register', element: <div>Register</div> },
      { path: 'forgot-password', element: <div>Forgot Password</div> },
    ],
  },
];
