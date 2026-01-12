export const AI_RATE_LIMIT_WINDOWS = {
  DAILY: 'daily',
  MONTHLY: 'monthly',
} as const;

export type AIRateLimitWindow =
  typeof AI_RATE_LIMIT_WINDOWS[keyof typeof AI_RATE_LIMIT_WINDOWS];

export const DEFAULT_AI_LIMITS = {
  USER: {
    daily: 50,
    monthly: 1000,
  },
  ROLE: {
    daily: 200,
    monthly: 5000,
  },
  HOSPITAL: {
    daily: 2000,
    monthly: 50000,
  },
};

export const AI_RATE_LIMIT_ERRORS = {
  RATE_LIMIT_EXCEEDED: 'AI_RATE_LIMIT_EXCEEDED',
};
