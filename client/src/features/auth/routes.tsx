import { RouteObject } from 'react-router-dom';
import { LoginScreen } from './login/screens';

/**
 * Auth Routes
 * Mounted under / or /auth
 */
export const authRoutes: RouteObject[] = [
  {
    path: 'login',
    element: <LoginScreen />,
  },
  {
    path: 'signup',
    element: <div>Signup Page - Coming Soon</div>,
  },
  {
    path: 'register',
    element: <div>Register Page - Coming Soon</div>,
  },
  {
    path: 'forgot-password',
    element: <div>Forgot Password - Coming Soon</div>,
  },
  {
    path: 'reset-password',
    element: <div>Reset Password - Coming Soon</div>,
  },
  {
    path: 'verify-email',
    element: <div>Verify Email - Coming Soon</div>,
  },
];

/**
 * Public auth routes (no auth required)
 */
export const publicAuthRoutes: RouteObject[] = [
  {
    path: 'login',
    element: <LoginScreen />,
  },
  {
    path: 'signup',
    element: <div>Signup Page - Coming Soon</div>,
  },
  {
    path: 'register',
    element: <div>Register Page - Coming Soon</div>,
  },
  {
    path: 'forgot-password',
    element: <div>Forgot Password - Coming Soon</div>,
  },
  {
    path: 'reset-password',
    element: <div>Reset Password - Coming Soon</div>,
  },
  {
    path: 'verify-email',
    element: <div>Verify Email - Coming Soon</div>,
  },
];

/**
 * Protected auth routes (require authentication)
 */
export const protectedAuthRoutes: RouteObject[] = [];