import type { ID, Timestamps } from "../shared";

/**
 * Patient account status
 */
export enum PatientStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  SUSPENDED = "SUSPENDED",
}

/**
 * Core Patient entity
 * Linked to a User record
 */
export interface Patient extends Timestamps {
  readonly id: ID;
  readonly userId: ID;

  readonly name: string;
  readonly gender?: "MALE" | "FEMALE" | "OTHER";
  readonly dateOfBirth?: string; // ISO 8601 date

  readonly status: PatientStatus;
}
