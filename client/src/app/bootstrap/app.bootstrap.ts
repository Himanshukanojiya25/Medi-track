// src/app/bootstrap/app.bootstrap.ts
import { bootstrapEnv } from "./env.bootstrap";
import { bootstrapAnalytics } from "./analytics.bootstrap";
import { bootstrapFeatureFlags } from "./feature-flags.bootstrap";
import { bootstrapAI } from "./ai.bootstrap";

export const bootstrapApp = async (): Promise<void> => {
  console.info("[BOOTSTRAP] App initialization started");

  bootstrapEnv();
  bootstrapFeatureFlags();
  bootstrapAnalytics();
  bootstrapAI();

  console.info("[BOOTSTRAP] App initialization completed");
};
