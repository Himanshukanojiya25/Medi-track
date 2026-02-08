export const FEATURES = {
  AI_SYMPTOM_CHECKER: "ai_symptom_checker",
  AI_CHAT: "ai_chat",
  APPOINTMENT_BOOKING: "appointment_booking",
  PRESCRIPTIONS: "prescriptions",
  BILLING: "billing",
  ANALYTICS: "analytics",
  NOTIFICATIONS: "notifications",
  FILE_UPLOADS: "file_uploads",
} as const;

export type FeatureKey = (typeof FEATURES)[keyof typeof FEATURES];

export const DEFAULT_ENABLED_FEATURES: FeatureKey[] = [
  FEATURES.APPOINTMENT_BOOKING,
  FEATURES.NOTIFICATIONS,
];
