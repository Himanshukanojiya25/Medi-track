/**
 * System roles (backend is source of truth)
 * Keep enum explicit to avoid magic strings
 */
export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  HOSPITAL_ADMIN = "HOSPITAL_ADMIN",
  DOCTOR = "DOCTOR",
  PATIENT = "PATIENT",
}

/**
 * Roles allowed to access dashboard areas
 */
export type DashboardRole =
  | UserRole.SUPER_ADMIN
  | UserRole.HOSPITAL_ADMIN
  | UserRole.DOCTOR;

/**
 * Public-facing role(s)
 */
export type PublicRole = UserRole.PATIENT;
