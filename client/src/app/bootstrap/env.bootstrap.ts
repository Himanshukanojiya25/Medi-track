// src/app/bootstrap/env.bootstrap.ts
import { envConfig } from "../config/env.config";

export const bootstrapEnv = (): void => {
  try {
    envConfig.validate();
    console.info("[BOOTSTRAP] Environment validated");
  } catch (error) {
    console.error("[BOOTSTRAP] Invalid environment configuration");
    throw error; // ❌ HARD FAIL
  }
};
