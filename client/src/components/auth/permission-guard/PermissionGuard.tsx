// client/src/components/auth/permission-guard/PermissionGuard.tsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthService from '../../../services/auth/auth.service';
import { hasPermission } from '../../../utils/auth/permission-check.util';
import { ROLES, ROLE_PERMISSIONS } from '../../../app/constants/role.constants';
import type { AppRole } from '../../../app/constants/role.constants';

interface PermissionGuardProps {
  children: React.ReactNode;
  requiredPermission: string;
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
 * PermissionGuard component
 * Restricts access to children based on user permissions
 */
export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  requiredPermission,
  fallback,
  redirectTo,
}) => {
  const user = AuthService.getCurrentUser();
  
  if (!user) {
    return redirectTo ? <Navigate to={redirectTo} replace /> : null;
  }
  
  const appRole = mapBackendRoleToAppRole(user.role);
  const userPermissions = ROLE_PERMISSIONS[appRole] || [];
  
  const hasRequiredPermission = hasPermission(userPermissions, requiredPermission);
  
  if (!hasRequiredPermission) {
    if (fallback) {
      return <>{fallback}</>;
    }
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-600">
          You don't have permission to access this page.
        </p>
      </div>
    );
  }
  
  return <>{children}</>;
};