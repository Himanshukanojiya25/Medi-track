import type { ID } from "../shared";

/**
 * Day of week (ISO-8601 aligned)
 * 1 = Monday ... 7 = Sunday
 */
export type Weekday = 1 | 2 | 3 | 4 | 5 | 6 | 7;

/**
 * Time slot in 24h HH:mm format
 * Example: "09:30"
 */
export type TimeString = string;

/**
 * Weekly recurring availability rule
 */
export interface DoctorAvailability {
  readonly id: ID;
  readonly doctorId: ID;

  readonly dayOfWeek: Weekday;
  readonly startTime: TimeString;
  readonly endTime: TimeString;

  readonly slotDurationMinutes: number;
  readonly isActive: boolean;
}
