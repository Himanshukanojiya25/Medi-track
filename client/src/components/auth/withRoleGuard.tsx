// client/src/components/auth/withRoleGuard.tsx

import React from 'react';
import { RoleGuard } from './role-guard/RoleGuard';
import type { AppRole } from '../../app/constants/role.constants';

interface WithRoleGuardOptions {
  allowedRoles: AppRole[];
  redirectTo?: string;
}

/**
 * HOC to wrap components with role-based protection
 */
export function withRoleGuard<P extends object>(
  Component: React.ComponentType<P>,
  options: WithRoleGuardOptions
): React.FC<P> {
  const WrappedComponent: React.FC<P> = (props) => {
    return (
      <RoleGuard allowedRoles={options.allowedRoles} redirectTo={options.redirectTo}>
        <Component {...props} />
      </RoleGuard>
    );
  };
  
  WrappedComponent.displayName = `withRoleGuard(${Component.displayName || Component.name || 'Component'})`;
  
  return WrappedComponent;
}