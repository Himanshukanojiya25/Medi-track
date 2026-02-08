/**
 * Feature usage limits per plan
 */
export interface FeatureLimit {
  readonly key: string;        // e.g. "AI_REQUESTS_PER_DAY"
  readonly limit: number;      // -1 means unlimited
}

/**
 * Plan → feature limits mapping
 */
export interface PlanFeatureLimits {
  readonly planId: string;
  readonly limits: readonly FeatureLimit[];
}
