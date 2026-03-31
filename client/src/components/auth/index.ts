// client/src/components/auth/index.ts

// Export from permission-guard
export { PermissionGuard } from './permission-guard';

// Export from protected
export { Protected } from './protected';

// Export from role-guard
export { RoleGuard, RoleBasedRenderer } from './role-guard';

// Export Higher-Order Components - WITHOUT .tsx extension
export { withRoleGuard } from './withRoleGuard';
export { withPermission } from './withPermission';

// Re-export types
export type { AppRole } from '../../app/constants/role.constants';
export { ROLES, ROLE_DASHBOARD_ROUTES, ROLE_DISPLAY_NAMES, ROLE_PERMISSIONS } from '../../app/constants/role.constants';