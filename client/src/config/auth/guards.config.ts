import { UserRole } from "../../types";
import { AUTH_CONFIG } from "./auth.config";

/**
 * Guard behavior configuration
 * No logic, only rules
 */
export const GUARDS_CONFIG = {
  /**
   * Guard: requires authenticated user
   */
  authRequired: {
    redirectTo: AUTH_CONFIG.redirects.afterLogout,
  },

  /**
   * Guard: requires guest (NOT logged in)
   */
  guestOnly: {
    redirectTo: AUTH_CONFIG.redirects.afterLogin,
  },

  /**
   * Guard: requires specific role(s)
   */
  roleRequired: {
    allowedRoles: AUTH_CONFIG.dashboardRoles as readonly UserRole[],
    redirectTo: AUTH_CONFIG.redirects.unauthorized,
  },
} as const;
