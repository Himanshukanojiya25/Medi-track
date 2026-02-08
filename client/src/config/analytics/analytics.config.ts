/**
 * Global analytics configuration
 * Tracking logic lives elsewhere
 */
export const ANALYTICS_CONFIG = {
  /**
   * Master switch
   */
  enabled: true,

  /**
   * Track page views automatically
   */
  autoPageTracking: true,

  /**
   * Anonymize user identifiers (GDPR-safe)
   */
  anonymizeUser: true,

  /**
   * Sampling rate (0–1)
   * 1 = track all events
   */
  sampleRate: 1,
} as const;
