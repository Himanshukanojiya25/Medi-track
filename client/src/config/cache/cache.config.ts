import { CACHE_TTL } from "./ttl.config";

/**
 * Cache behavior configuration
 * Used by store / services / SWR-like layers
 */
export const CACHE_CONFIG = {
  /**
   * Enable or disable caching globally
   */
  enabled: true,

  /**
   * Default TTL when none specified
   */
  defaultTTL: CACHE_TTL.MEDIUM,

  /**
   * Cache key namespaces
   * Prevents collisions across domains
   */
  namespaces: {
    AUTH: "auth",
    USER: "user",
    HOSPITAL: "hospital",
    DOCTOR: "doctor",
    PATIENT: "patient",
    APPOINTMENT: "appointment",
    BILLING: "billing",
    ANALYTICS: "analytics",
    AI: "ai",
  },

  /**
   * Stale-While-Revalidate strategy
   */
  swr: {
    enabled: true,
    maxStaleTime: CACHE_TTL.SHORT,
  },
} as const;
