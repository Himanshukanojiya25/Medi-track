/**
 * Time-to-live values (in seconds)
 * Centralized to avoid magic numbers
 */
export const CACHE_TTL = {
  SHORT: 30,          // 30s (volatile data)
  MEDIUM: 5 * 60,     // 5 min
  LONG: 30 * 60,      // 30 min
  VERY_LONG: 24 * 60 * 60, // 24 hrs

  /**
   * Domain-specific TTLs
   */
  AUTH_SESSION: 15 * 60,        // 15 min
  USER_PROFILE: 10 * 60,        // 10 min
  HOSPITAL_METADATA: 60 * 60,   // 1 hr
  DOCTOR_AVAILABILITY: 5 * 60,  // 5 min
  ANALYTICS_SUMMARY: 15 * 60,   // 15 min
  AI_USAGE: 60,                 // 1 min
} as const;
