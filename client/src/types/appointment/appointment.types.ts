import type { ID, Timestamps } from "../shared";
import type { AppointmentStatus } from "./appointment-status.types";

/**
 * Appointment booking entity
 * Central business record
 */
export interface Appointment extends Timestamps {
  readonly id: ID;

  readonly patientId: ID;
  readonly doctorId: ID;
  readonly hospitalId: ID;

  readonly status: AppointmentStatus;

  /**
   * Scheduled time (exact slot)
   */
  readonly scheduledAt: string; // ISO 8601 datetime

  /**
   * Duration in minutes
   */
  readonly durationMinutes: number;

  /**
   * Optional notes
   */
  readonly reason?: string;
  readonly cancellationReason?: string;
}
