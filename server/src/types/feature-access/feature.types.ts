/**
 * All features supported by the system.
 * This is a shared contract between:
 * - feature-access service
 * - feature-access middleware
 * - future admin / analytics layers
 */
export enum FEATURES {
  AI_CHAT = "AI_CHAT",
  ADVANCED_ANALYTICS = "ADVANCED_ANALYTICS",
  PRIORITY_SUPPORT = "PRIORITY_SUPPORT",
}

/**
 * Generic feature access response
 * (useful for future debugging / admin APIs)
 */
export interface FeatureAccessResult {
  feature: FEATURES;
  allowed: boolean;
}
