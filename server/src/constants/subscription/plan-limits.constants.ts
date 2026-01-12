import { SUBSCRIPTION_PLANS } from "./plans.constants";

export const PLAN_LIMITS = {
  [SUBSCRIPTION_PLANS.FREE]: {
    aiMessagesPerDay: 20,
    advancedAnalytics: false,
  },
  [SUBSCRIPTION_PLANS.PRO]: {
    aiMessagesPerDay: 200,
    advancedAnalytics: true,
  },
  [SUBSCRIPTION_PLANS.ENTERPRISE]: {
    aiMessagesPerDay: Infinity,
    advancedAnalytics: true,
  },
} as const;
