import type { ID } from "../shared";

/**
 * Doctor leave status
 */
export enum DoctorLeaveStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

/**
 * Doctor leave record
 */
export interface DoctorLeave {
  readonly id: ID;
  readonly doctorId: ID;

  readonly startDate: string; // ISO 8601 date
  readonly endDate: string;   // ISO 8601 date

  readonly reason?: string;
  readonly status: DoctorLeaveStatus;
}
