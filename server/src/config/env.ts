import dotenv from "dotenv";

/**
 * Load environment variables
 * - Local: loads from .env
 * - Railway / Prod: uses platform-injected env vars
 */
dotenv.config();

/**
 * Helper to read env variables safely
 */
function getEnv(key: string, required = true): string | undefined {
  const value = process.env[key];

  if (!value && required) {
    throw new Error(
      `[ENV ERROR] Missing required environment variable: ${key}`
    );
  }

  return value;
}

/**
 * Centralized, validated env config
 * ONLY export from here – never use process.env directly
 */
export const ENV = {
  // ===============================
  // SERVER
  // ===============================
  NODE_ENV: getEnv("NODE_ENV", false) ?? "development",
  PORT: Number(getEnv("PORT", false) ?? 8080),

  // ===============================
  // DATABASE
  // ===============================
  MONGO_URI: getEnv("MONGO_URI", true)!,

  // ===============================
  // AUTH / JWT
  // ===============================
  JWT_ACCESS_SECRET: getEnv("JWT_ACCESS_SECRET", true)!,
  JWT_REFRESH_SECRET: getEnv("JWT_REFRESH_SECRET", true)!,

  JWT_ACCESS_EXPIRES_IN:
    getEnv("JWT_ACCESS_EXPIRES_IN", false) ?? "15m",

  JWT_REFRESH_EXPIRES_IN:
    getEnv("JWT_REFRESH_EXPIRES_IN", false) ?? "7d",

  // ===============================
  // SECURITY
  // ===============================
  BCRYPT_SALT_ROUNDS: Number(
    getEnv("BCRYPT_SALT_ROUNDS", false) ?? 10
  ),

  // ===============================
  // AI (OPTIONAL – FREE MODE SAFE)
  // ===============================
  OPENAI_API_KEY: getEnv("OPENAI_API_KEY", false),
  OPENAI_API_BASE_URL: getEnv("OPENAI_API_BASE_URL", false),
  OPENAI_MODEL:
    getEnv("OPENAI_MODEL", false) ?? "gpt-4o-mini",
};

/**
 * Freeze to avoid runtime mutation
 */
Object.freeze(ENV);
