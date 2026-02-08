import { FEATURES } from "../constants/feature.constants";

/**
 * Feature Utilities
 * -----------------
 * Used by guards, registry, lifecycle
 */

export function isFeatureEnabled(feature: keyof typeof FEATURES): boolean {
  return Boolean(FEATURES[feature]);
}

export function assertFeatureEnabled(feature: keyof typeof FEATURES): void {
  if (!FEATURES[feature]) {
    throw new Error(`Feature "${feature}" is disabled`);
  }
}
