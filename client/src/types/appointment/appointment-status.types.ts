/**
 * Appointment lifecycle states
 * Must match backend state machine
 */
export enum AppointmentStatus {
  REQUESTED = "REQUESTED",     // patient requested
  CONFIRMED = "CONFIRMED",     // doctor / hospital approved
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  NO_SHOW = "NO_SHOW",
}
