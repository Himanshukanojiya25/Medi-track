export const AI_ERRORS = {
  AI_DISABLED: {
    code: "AI_DISABLED",
    message: "AI is currently disabled",
  },

  AI_ACCESS_DENIED: {
    code: "AI_ACCESS_DENIED",
    message: "You are not allowed to access AI features",
  },

  AI_RATE_LIMIT_EXCEEDED: {
    code: "AI_RATE_LIMIT_EXCEEDED",
    message: "AI rate limit exceeded",
  },

  AI_USAGE_LIMIT_EXCEEDED: {
    code: "AI_USAGE_LIMIT_EXCEEDED",
    message: "AI usage limit exceeded",
  },
} as const;
