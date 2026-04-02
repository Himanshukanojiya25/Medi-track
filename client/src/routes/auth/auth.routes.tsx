// src/routes/auth/auth.routes.ts
import { RouteObject } from 'react-router-dom';
import { AuthLayout } from '../../layouts/auth/AuthLayout';
import { RegisterScreen } from '../../features/auth/register/screens/RegisterScreen';
import { LoginScreen } from '../../features/auth/login/screens/LoginScreen';
// import { ForgotPasswordScreen } from '../../features/auth/forgot-password/screens/ForgotPasswordScreen';

export const AuthRoutes: RouteObject[] = [
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <LoginScreen /> },
      { path: 'register', element: <RegisterScreen /> },         // ✅ actual component
      // { path: 'forgot-password', element: <ForgotPasswordScreen /> },
    ],
  },
];
