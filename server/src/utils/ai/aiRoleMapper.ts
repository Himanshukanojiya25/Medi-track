/**
 * Maps system roles to AI-safe roles
 * AI layer MUST NOT depend on auth/db enums
 */

export type AIRole =
  | "patient"
  | "doctor"
  | "hospital-admin"
  | "hospital"
  | "super-admin";

const ROLE_MAP: Record<string, AIRole> = {
  PATIENT: "patient",
  DOCTOR: "doctor",
  HOSPITAL_ADMIN: "hospital-admin",
  HOSPITAL: "hospital",
  SUPER_ADMIN: "super-admin",

  // fallback-safe lowercase keys
  "patient": "patient",
  "doctor": "doctor",
  "hospital-admin": "hospital-admin",
  "hospital": "hospital",
  "super-admin": "super-admin",
};

export function mapRoleToAIRole(role: string): AIRole {
  const mapped = ROLE_MAP[role];

  if (!mapped) {
    throw new Error(`Unsupported role for AI: ${role}`);
  }

  return mapped;
}
