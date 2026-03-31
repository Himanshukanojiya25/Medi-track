// client/src/components/auth/protected/Protected.tsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthService from '../../../services/auth/auth.service';

interface ProtectedProps {
  children: React.ReactNode;
  redirectTo?: string;
  fallback?: React.ReactNode;
}

/**
 * Protected component
 * Restricts access to authenticated users only
 */
export const Protected: React.FC<ProtectedProps> = ({
  children,
  redirectTo = '/login',
  fallback,
}) => {
  const isAuthenticated = AuthService.isAuthenticated();
  const isLoading = false; // You can add loading state if needed
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return <Navigate to={redirectTo} replace />;
  }
  
  return <>{children}</>;
};