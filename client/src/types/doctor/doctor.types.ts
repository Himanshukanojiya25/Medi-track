import type { ID, Timestamps } from "../shared";

/**
 * Doctor professional status
 */
export enum DoctorStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  ON_LEAVE = "ON_LEAVE",
}

/**
 * Core Doctor entity
 * Linked to a User + Hospital
 */
export interface Doctor extends Timestamps {
  readonly id: ID;
  readonly userId: ID;
  readonly hospitalId: ID;

  readonly name: string;
  readonly specialization: string;
  readonly experienceYears: number;

  readonly status: DoctorStatus;
}
