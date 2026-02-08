// src/app/bootstrap/index.ts
import { bootstrapEnv } from "./env.bootstrap";
import { bootstrapApp } from "./app.bootstrap";
import { bootstrapFeatureFlags } from "./feature-flags.bootstrap";
import { bootstrapAnalytics } from "./analytics.bootstrap";
import { bootstrapAI } from "./ai.bootstrap";

export function bootstrapApplication(): void {
  // 1️⃣ Environment validation (hard fail)
  bootstrapEnv();

  // 2️⃣ App metadata & runtime
  bootstrapApp();

  // 3️⃣ Feature flags
  bootstrapFeatureFlags();

  // 4️⃣ Analytics (optional)
  bootstrapAnalytics();

  // 5️⃣ AI system (optional + guarded)
  bootstrapAI();
}
