import { EnvSchema } from "./env.schema";

/**
 * Parse & validate environment variables
 * Runs once at app bootstrap
 */
const parsed = EnvSchema.safeParse({
  MODE: import.meta.env.MODE,
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL,

  ENABLE_AI: import.meta.env.VITE_ENABLE_AI === "true",
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === "true",

  APP_NAME: import.meta.env.VITE_APP_NAME,
});

if (!parsed.success) {
  console.error("❌ Invalid environment configuration", parsed.error.format());
  throw new Error("Invalid environment configuration");
}

export const ENV = parsed.data;
