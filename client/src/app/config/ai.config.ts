// src/app/config/ai.config.ts
import { envConfig } from "./env.config";

interface AIConfigShape {
  enabled: boolean;
  maxDailyRequests: number;
}

class AIConfig {
  private readonly config: AIConfigShape;

  constructor() {
    this.config = {
      enabled: envConfig.get().ENABLE_AI,
      maxDailyRequests: 50,
    };
  }

  initialize(): void {
    // preload AI metadata, limits, etc
  }

  get(): Readonly<AIConfigShape> {
    return Object.freeze(this.config);
  }
}

export const aiConfig = new AIConfig();
