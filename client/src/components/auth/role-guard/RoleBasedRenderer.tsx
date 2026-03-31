// client/src/components/auth/role-guard/RoleBasedRenderer.tsx

import React from 'react';
import AuthService from '../../../services/auth/auth.service';
import { ROLES } from '../../../app/constants/role.constants';
import type { AppRole } from '../../../app/constants/role.constants';

interface RoleBasedRendererProps {
  patient: React.ReactNode;
  doctor: React.ReactNode;
  hospitalAdmin: React.ReactNode;
  superAdmin: React.ReactNode;
  fallback?: React.ReactNode;
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
 * RoleBasedRenderer component
 * Renders different content based on user role
 */
export const RoleBasedRenderer: React.FC<RoleBasedRendererProps> = ({
  patient,
  doctor,
  hospitalAdmin,
  superAdmin,
  fallback,
}) => {
  const user = AuthService.getCurrentUser();
  
  if (!user) {
    return <>{fallback || null}</>;
  }
  
  const userRole = mapBackendRoleToAppRole(user.role);
  
  switch (userRole) {
    case ROLES.PATIENT:
      return <>{patient}</>;
    case ROLES.DOCTOR:
      return <>{doctor}</>;
    case ROLES.HOSPITAL_ADMIN:
      return <>{hospitalAdmin}</>;
    case ROLES.SUPER_ADMIN:
      return <>{superAdmin}</>;
    default:
      return <>{fallback || null}</>;
  }
};