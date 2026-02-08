import { FEATURE_REGISTRY } from "../registry/feature.registry";

/**
 * Feature key derived from registry
 */
export type FeatureKey = keyof typeof FEATURE_REGISTRY;

/**
 * Feature Guard
 * -----------------------
 * Enables or disables feature at runtime.
 */
export function featureGuard(feature: FeatureKey): boolean {
  return Boolean(FEATURE_REGISTRY[feature]);
}
