import { UserRole } from "../../types";

/**
 * High-level authentication behavior config
 */
export const AUTH_CONFIG = {
  /**
   * Routes that do NOT require authentication
   */
  publicRoutes: [
    "/",
    "/login",
    "/signup",
    "/forgot-password",
  ],

  /**
   * Routes accessible only when NOT logged in
   */
  guestOnlyRoutes: [
    "/login",
    "/signup",
  ],

  /**
   * Default redirect paths
   */
  redirects: {
    afterLogin: "/dashboard",
    afterLogout: "/login",
    unauthorized: "/unauthorized",
  },

  /**
   * Roles allowed to access dashboard shell
   */
  dashboardRoles: [
    UserRole.SUPER_ADMIN,
    UserRole.HOSPITAL_ADMIN,
    UserRole.DOCTOR,
  ],
} as const;
