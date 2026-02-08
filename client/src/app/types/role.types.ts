/**
 * Role Types
 * ----------
 * Central authority for role typing
 */

export type Role =
  | "public"
  | "patient"
  | "doctor"
  | "hospital-admin"
  | "super-admin";

export interface RoleContext {
  role: Role;
  permissions: string[];
}
