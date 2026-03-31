// client/src/components/auth/role-guard/ProtectedRoute.tsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthService from '../../../services/auth/auth.service';
import { ROLES, ROLE_DASHBOARD_ROUTES } from '../../../app/constants/role.constants';
import type { AppRole } from '../../../app/constants/role.constants';

interface ProtectedRouteProps {
  allowedRoles?: AppRole[];
  redirectTo?: string;
  children?: React.ReactNode;
}

/**
 * Map backend role to frontend role
 */
const mapBackendRoleToAppRole = (backendRole: string): AppRole => {
  const roleMap: Record<string, AppRole> = {
    'SUPER_ADMIN': ROLES.SUPER_ADMIN,
    'HOSPITAL_ADMIN': ROLES.HOSPITAL_ADMIN,
    'DOCTOR': ROLES.DOCTOR,
    'PATIENT': ROLES.PATIENT,
  };
  return roleMap[backendRole] || ROLES.PATIENT;
};

/**
 * ProtectedRoute component
 * Protects routes based on authentication and roles
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  allowedRoles, 
  redirectTo,
  children 
}) => {
  const isAuthenticated = AuthService.isAuthenticated();
  const user = AuthService.getCurrentUser();
  
  // Show loading state while checking auth (optional)
  const [isLoading, setIsLoading] = React.useState(true);
  
  React.useEffect(() => {
    // Small delay to ensure auth state is loaded
    const timer = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }
  
  // Not authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectTo || '/login'} replace />;
  }
  
  // If no role restrictions, allow access
  if (!allowedRoles || allowedRoles.length === 0) {
    return children ? <>{children}</> : <Outlet />;
  }
  
  // Check role
  if (user) {
    const userRole = mapBackendRoleToAppRole(user.role);
    
    if (allowedRoles.includes(userRole)) {
      return children ? <>{children}</> : <Outlet />;
    }
    
    // Role not allowed - redirect to user's own dashboard
    const dashboardRoute = ROLE_DASHBOARD_ROUTES[userRole];
    return <Navigate to={dashboardRoute} replace />;
  }
  
  return <Navigate to="/login" replace />;
};