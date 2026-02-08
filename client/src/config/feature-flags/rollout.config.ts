/**
 * Rollout strategy configuration
 * Used for gradual enablement
 */
export const ROLLOUT_CONFIG = {
  /**
   * Percentage-based rollout (0–100)
   * Store/services decide how to calculate user bucket
   */
  percentage: {
    AI_CHAT: 100,
    AI_INSIGHTS: 100,
    ANALYTICS_DASHBOARD: 100,
  },

  /**
   * Role-based rollout
   */
  roles: {
    AI_CHAT: ["SUPER_ADMIN", "HOSPITAL_ADMIN", "DOCTOR", "PATIENT"],
    ANALYTICS_DASHBOARD: ["SUPER_ADMIN", "HOSPITAL_ADMIN"],
  },
} as const;
