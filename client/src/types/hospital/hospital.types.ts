import type { ID, Timestamps, SoftDeletable } from "../shared";

/**
 * Hospital operational status
 */
export enum HospitalStatus {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  SUSPENDED = "SUSPENDED",
}

/**
 * Core Hospital entity
 */
export interface Hospital extends Timestamps, SoftDeletable {
  readonly id: ID;
  readonly name: string;
  readonly code: string; // stable, human-readable identifier
  readonly status: HospitalStatus;

  readonly address: {
    readonly line1: string;
    readonly line2?: string;
    readonly city: string;
    readonly state: string;
    readonly country: string;
    readonly postalCode: string;
  };

  readonly contact: {
    readonly email: string;
    readonly phone?: string;
  };
}
