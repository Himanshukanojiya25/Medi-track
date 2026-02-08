// src/app/bootstrap/analytics.bootstrap.ts
import { analyticsConfig } from "../config/analytics.config";

export const bootstrapAnalytics = (): void => {
  if (!analyticsConfig.enabled) {
    console.info("[BOOTSTRAP] Analytics disabled");
    return;
  }

  analyticsConfig.initialize();
  console.info("[BOOTSTRAP] Analytics initialized");
};
