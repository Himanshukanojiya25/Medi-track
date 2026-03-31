// client/src/components/auth/role-guard/RoleGuard.tsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthService from '../../../services/auth/auth.service';
import { ROLES, ROLE_DASHBOARD_ROUTES } from '../../../app/constants/role.constants';
import type { AppRole } from '../../../app/constants/role.constants';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: AppRole[];
  fallback?: React.ReactNode;
  redirectTo?: string;
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
 * RoleGuard component
 * Restricts access to children based on user roles
 */
export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  allowedRoles,
  fallback,
  redirectTo,
}) => {
  const user = AuthService.getCurrentUser();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  const userRole = mapBackendRoleToAppRole(user.role);
  const hasAllowedRole = allowedRoles.includes(userRole);
  
  if (!hasAllowedRole) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    // Redirect to user's own dashboard
    const dashboardRoute = ROLE_DASHBOARD_ROUTES[userRole];
    
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }
    
    return <Navigate to={dashboardRoute} replace />;
  }
  
  return <>{children}</>;
};