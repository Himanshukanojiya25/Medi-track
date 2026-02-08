import { ENV } from "../env";

/**
 * Runtime behavior configuration
 * Affects how app behaves in browser
 */
export const RUNTIME_CONFIG = {
  isProduction: ENV.MODE === "production",
  isDevelopment: ENV.MODE === "development",

  /**
   * Safety & UX defaults
   */
  strictMode: ENV.MODE !== "production",
  enableDebugLogs: ENV.MODE !== "production",
} as const;
