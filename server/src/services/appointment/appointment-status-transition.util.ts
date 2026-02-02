import { AppointmentStatus } from "../../constants/status";

/**
 * Centralized appointment status transition rules
 * IMPORTANT: All enum values MUST be mapped
 */
const STATUS_TRANSITIONS: Record<
  AppointmentStatus,
  AppointmentStatus[]
> = {
  [AppointmentStatus.SCHEDULED]: [
    AppointmentStatus.COMPLETED,
    AppointmentStatus.CANCELLED,
  ],

  [AppointmentStatus.CONFIRMED]: [
    AppointmentStatus.COMPLETED,
    AppointmentStatus.CANCELLED,
  ],

  [AppointmentStatus.COMPLETED]: [],

  [AppointmentStatus.CANCELLED]: [],

  [AppointmentStatus.NO_SHOW]: [],
};

export function canTransitionStatus(
  from: AppointmentStatus,
  to: AppointmentStatus
): boolean {
  return STATUS_TRANSITIONS[from]?.includes(to) ?? false;
}
