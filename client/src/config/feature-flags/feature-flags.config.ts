/**
 * Global feature flags
 * Simple ON / OFF switches
 */
export const FEATURE_FLAGS = {
  /**
   * AI features
   */
  AI_CHAT: true,
  AI_INSIGHTS: true,

  /**
   * Analytics & dashboards
   */
  ANALYTICS_DASHBOARD: true,

  /**
   * Billing & subscriptions
   */
  SUBSCRIPTIONS: true,
  PAYMENTS: true,

  /**
   * Notifications
   */
  IN_APP_NOTIFICATIONS: true,
} as const;
