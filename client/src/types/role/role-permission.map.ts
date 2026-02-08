import { UserRole } from "./role.types";
import { Permission } from "./permission.types";

/**
 * Central RBAC mapping
 * Single source of truth for UI gating & guards
 */
export type RolePermissionMap = Readonly<
  Record<UserRole, readonly Permission[]>
>;

export const DEFAULT_ROLE_PERMISSIONS: RolePermissionMap = {
  [UserRole.SUPER_ADMIN]: Object.values(Permission),

  [UserRole.HOSPITAL_ADMIN]: [
    Permission.HOSPITAL_VIEW,
    Permission.HOSPITAL_MANAGE,
    Permission.DOCTOR_VIEW,
    Permission.DOCTOR_MANAGE,
    Permission.APPOINTMENT_VIEW,
    Permission.APPOINTMENT_MANAGE,
    Permission.BILLING_VIEW,
    Permission.BILLING_MANAGE,
  ],

  [UserRole.DOCTOR]: [
    Permission.DOCTOR_VIEW,
    Permission.APPOINTMENT_VIEW,
    Permission.APPOINTMENT_MANAGE,
    Permission.PATIENT_VIEW,
  ],

  [UserRole.PATIENT]: [
    Permission.PATIENT_VIEW,
    Permission.APPOINTMENT_VIEW,
  ],
};
