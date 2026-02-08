import { ROLES } from "../constants/role.constants";
import type { Role } from "../types";

/**
 * Role Utilities
 * --------------
 * Works with object-based role constants
 */

const ROLE_VALUES = Object.values(ROLES) as Role[];

export function isValidRole(role: string): role is Role {
  return ROLE_VALUES.includes(role as Role);
}

export function assertRole(role: string): asserts role is Role {
  if (!ROLE_VALUES.includes(role as Role)) {
    throw new Error(`Invalid role: ${role}`);
  }
}
