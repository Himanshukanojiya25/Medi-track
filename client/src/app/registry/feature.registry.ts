import { FEATURES, FeatureKey, PHASES, AppPhase } from "../constants";

export const FEATURE_REGISTRY: Record<
  FeatureKey,
  {
    phase: AppPhase;
    description: string;
  }
> = {
  ai_symptom_checker: {
    phase: PHASES.PHASE_1,
    description: "Public AI symptom checker",
  },
  ai_chat: {
    phase: PHASES.PHASE_6,
    description: "AI chat assistant",
  },
  appointment_booking: {
    phase: PHASES.PHASE_2,
    description: "Appointment booking system",
  },
  prescriptions: {
    phase: PHASES.PHASE_2,
    description: "Prescriptions management",
  },
  billing: {
    phase: PHASES.PHASE_5,
    description: "Billing & invoices",
  },
  analytics: {
    phase: PHASES.PHASE_4,
    description: "Analytics dashboards",
  },
  notifications: {
    phase: PHASES.PHASE_2,
    description: "Notification system",
  },
  file_uploads: {
    phase: PHASES.PHASE_2,
    description: "Reports & file uploads",
  },
};
