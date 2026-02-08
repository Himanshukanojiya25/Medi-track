// src/app/bootstrap/ai.bootstrap.ts
import { aiConfig } from "../config/ai.config";

export function bootstrapAI(): void {
  const config = aiConfig.get();

  if (!config.enabled) {
    return;
  }

  aiConfig.initialize();
}
