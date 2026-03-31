// client/src/components/auth/withPermission.tsx

import React from 'react';
import { PermissionGuard } from './permission-guard/PermissionGuard';

interface WithPermissionOptions {
  requiredPermission: string;
  redirectTo?: string;
  fallback?: React.ReactNode;
}

/**
 * HOC to wrap components with permission-based protection
 */
export function withPermission<P extends object>(
  Component: React.ComponentType<P>,
  options: WithPermissionOptions
): React.FC<P> {
  const WrappedComponent: React.FC<P> = (props) => {
    return (
      <PermissionGuard 
        requiredPermission={options.requiredPermission} 
        redirectTo={options.redirectTo}
        fallback={options.fallback}
      >
        <Component {...props} />
      </PermissionGuard>
    );
  };
  
  WrappedComponent.displayName = `withPermission(${Component.displayName || Component.name || 'Component'})`;
  
  return WrappedComponent;
}