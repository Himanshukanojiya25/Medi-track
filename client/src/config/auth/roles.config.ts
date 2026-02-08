import { UserRole } from "../../types";

/**
 * Role hierarchy & grouping
 * Used for UI gating & guard shortcuts
 */
export const ROLE_CONFIG = {
  hierarchy: [
    UserRole.SUPER_ADMIN,
    UserRole.HOSPITAL_ADMIN,
    UserRole.DOCTOR,
    UserRole.PATIENT,
  ],

  /**
   * Roles with administrative privileges
   */
  adminRoles: [
    UserRole.SUPER_ADMIN,
    UserRole.HOSPITAL_ADMIN,
  ],

  /**
   * Roles that represent medical staff
   */
  staffRoles: [
    UserRole.DOCTOR,
  ],
} as const;
