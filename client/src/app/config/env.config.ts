// src/app/config/env.config.ts
export type AppMode = "development" | "staging" | "production";

interface EnvConfigShape {
  MODE: AppMode;
  API_BASE_URL: string;
  ENABLE_ANALYTICS: boolean;
  ENABLE_AI: boolean;
}

class EnvConfig {
  private readonly env: EnvConfigShape;

  constructor() {
    this.env = {
      MODE: import.meta.env.VITE_APP_MODE ?? "development",
      API_BASE_URL: import.meta.env.VITE_API_BASE_URL ?? "",
      ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === "true",
      ENABLE_AI: import.meta.env.VITE_ENABLE_AI === "true",
    };
  }

  validate(): void {
    if (!this.env.API_BASE_URL) {
      throw new Error("❌ VITE_API_BASE_URL is missing");
    }
  }

  get(): Readonly<EnvConfigShape> {
    return Object.freeze(this.env);
  }
}

export const envConfig = new EnvConfig();
