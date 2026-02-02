/**
 * Notification Event Templates
 * ----------------------------
 * Centralized definitions for all system-triggered notifications
 */

export const NotificationEvents = {
  APPOINTMENT_BOOKED: {
    type: "appointment",
    title: "Appointment Confirmed",
    message: "Your appointment has been successfully booked.",
    actionUrl: "/appointments",
  },

  APPOINTMENT_CANCELLED: {
    type: "appointment",
    title: "Appointment Cancelled",
    message: "An appointment has been cancelled.",
    actionUrl: "/appointments",
  },

  APPOINTMENT_COMPLETED: {
    type: "appointment",
    title: "Appointment Completed",
    message: "Your appointment has been marked as completed.",
    actionUrl: "/appointments",
  },

  PRESCRIPTION_CREATED: {
    type: "doctor",
    title: "Prescription Available",
    message: "Your doctor has added a new prescription.",
    actionUrl: "/prescriptions",
  },
} as const;

export type NotificationEventKey = keyof typeof NotificationEvents;
