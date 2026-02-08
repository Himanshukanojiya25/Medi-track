/**
 * Central analytics event registry
 * Prevents magic strings across app
 */
export const ANALYTICS_EVENTS = {
  // Auth
  LOGIN_SUCCESS: "login_success",
  LOGOUT: "logout",

  // Navigation
  PAGE_VIEW: "page_view",

  // Appointments
  APPOINTMENT_BOOKED: "appointment_booked",
  APPOINTMENT_CANCELLED: "appointment_cancelled",

  // Billing
  PAYMENT_INITIATED: "payment_initiated",
  PAYMENT_SUCCESS: "payment_success",

  // AI
  AI_CHAT_STARTED: "ai_chat_started",
  AI_MESSAGE_SENT: "ai_message_sent",
} as const;
