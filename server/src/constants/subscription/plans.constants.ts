export const SUBSCRIPTION_PLANS = {
  FREE: "FREE",
  PRO: "PRO",
  ENTERPRISE: "ENTERPRISE",
} as const;

export type SubscriptionPlan =
  typeof SUBSCRIPTION_PLANS[keyof typeof SUBSCRIPTION_PLANS];
