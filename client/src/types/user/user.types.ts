import type { ID, Timestamps } from "../shared";
import type { UserRole } from "../role";

/**
 * User account status
 * Must match backend enum
 */
export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  SUSPENDED = "SUSPENDED",
}

/**
 * Core user entity
 * Represents persisted user record
 */
export interface User extends Timestamps {
  readonly id: ID;
  readonly email: string;
  readonly role: UserRole;
  readonly status: UserStatus;
}
