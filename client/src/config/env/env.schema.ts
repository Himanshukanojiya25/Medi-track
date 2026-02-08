import { z } from "zod";

/**
 * Environment variable validation schema
 * Fail-fast on invalid config
 */
export const EnvSchema = z.object({
  MODE: z.enum(["development", "staging", "production"]),

  API_BASE_URL: z.string().url(),

  ENABLE_AI: z.boolean(),
  ENABLE_ANALYTICS: z.boolean(),

  APP_NAME: z.string().min(1),
});
