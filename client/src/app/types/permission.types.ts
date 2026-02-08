/**
 * Permission Types
 * ----------------
 * Used by guards + registry
 */

export type Permission =
  | "read"
  | "write"
  | "update"
  | "delete"
  | "approve"
  | "manage";

export interface PermissionContext {
  permissions: Permission[];
}
