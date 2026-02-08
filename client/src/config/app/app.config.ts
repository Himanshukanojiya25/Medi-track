import { ENV } from "../env";

/**
 * Static application identity & meta
 * Safe to use anywhere in the app
 */
export const APP_CONFIG = {
  name: ENV.APP_NAME,
  mode: ENV.MODE,

  /**
   * Feature toggles (high-level)
   * Fine-grained flags live in feature-flags/
   */
  features: {
    ai: ENV.ENABLE_AI,
    analytics: ENV.ENABLE_ANALYTICS,
  },
} as const;
