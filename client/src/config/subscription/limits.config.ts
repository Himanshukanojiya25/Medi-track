/**
 * Feature usage limits per subscription plan
 * -1 = unlimited
 */
export const SUBSCRIPTION_LIMITS = {
  FREE: {
    AI_REQUESTS_PER_DAY: 10,
    APPOINTMENTS_PER_MONTH: 5,
    DOCTORS_ALLOWED: 1,
  },

  BASIC: {
    AI_REQUESTS_PER_DAY: 100,
    APPOINTMENTS_PER_MONTH: 50,
    DOCTORS_ALLOWED: 5,
  },

  PRO: {
    AI_REQUESTS_PER_DAY: 500,
    APPOINTMENTS_PER_MONTH: 500,
    DOCTORS_ALLOWED: 50,
  },

  ENTERPRISE: {
    AI_REQUESTS_PER_DAY: -1,
    APPOINTMENTS_PER_MONTH: -1,
    DOCTORS_ALLOWED: -1,
  },
} as const;
