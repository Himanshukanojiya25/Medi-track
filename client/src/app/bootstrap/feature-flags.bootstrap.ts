// src/app/bootstrap/feature-flags.bootstrap.ts
import { featureRegistry } from "../registry/feature.registry";

export const bootstrapFeatureFlags = (): void => {
  featureRegistry.freeze();
  console.info("[BOOTSTRAP] Feature flags locked");
};
