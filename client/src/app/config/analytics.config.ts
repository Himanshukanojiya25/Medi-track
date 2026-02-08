// src/app/config/analytics.config.ts
import { envConfig } from "./env.config";

class AnalyticsConfig {
  readonly enabled: boolean;

  constructor() {
    this.enabled = envConfig.get().ENABLE_ANALYTICS;
  }

  initialize(): void {
    // future: GA / Segment / Mixpanel
    // intentionally no-op for now
  }
}

export const analyticsConfig = new AnalyticsConfig();
