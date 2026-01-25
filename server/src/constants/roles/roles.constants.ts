/**
 * SINGLE SOURCE OF TRUTH FOR ROLES
 * ❌ No logic
 * ❌ No lowercase
 */

export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  HOSPITAL_ADMIN: "HOSPITAL_ADMIN",
  DOCTOR: "DOCTOR",
  PATIENT: "PATIENT",
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];
