export const SUBSCRIPTION_PLANS = {
  FREE: "free",
  BASIC: "basic",
  PRO: "pro",
  ENTERPRISE: "enterprise",
} as const;

export type SubscriptionPlan =
  (typeof SUBSCRIPTION_PLANS)[keyof typeof SUBSCRIPTION_PLANS];

export const PLAN_LIMITS: Record<
  SubscriptionPlan,
  {
    aiRequestsPerMonth: number;
    doctors: number;
    storageMB: number;
  }
> = {
  free: {
    aiRequestsPerMonth: 20,
    doctors: 1,
    storageMB: 100,
  },
  basic: {
    aiRequestsPerMonth: 500,
    doctors: 5,
    storageMB: 1024,
  },
  pro: {
    aiRequestsPerMonth: 5000,
    doctors: 25,
    storageMB: 10240,
  },
  enterprise: {
    aiRequestsPerMonth: Infinity,
    doctors: Infinity,
    storageMB: Infinity,
  },
};
