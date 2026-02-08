import { ROLES } from "../constants/role.constants";

/**
 * Derived Role type from ROLES constant
 */
export type Role = (typeof ROLES)[keyof typeof ROLES];

/**
 * Role Guard
 * -----------------------
 * Checks whether user's role is allowed.
 */
export function roleGuard(
  userRole: Role | null | undefined,
  allowedRoles: readonly Role[]
): boolean {
  if (!userRole) return false;
  return allowedRoles.includes(userRole);
}
