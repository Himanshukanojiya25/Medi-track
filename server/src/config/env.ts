import dotenv from "dotenv";
import path from "path";

/**
 * Load environment variables
 * Priority:
 * 1. server/.env
 * 2. process.env (already set by platform)
 */
dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});

/**
 * Helper to read env variables safely
 */
function getEnv(key: string, required = true): string {
  const value = process.env[key];

  if (!value && required) {
    throw new Error(
      `[ENV ERROR] Missing required environment variable: ${key}`
    );
  }

  return value as string;
}

/**
 * Centralized, validated env config
 * ONLY export from here – never use process.env directly
 */
export const ENV = {
  // ===============================
  // SERVER
  // ===============================
  NODE_ENV: getEnv("NODE_ENV", false) || "development",
  PORT: Number(getEnv("PORT", false) || 5000),

  // ===============================
  // DATABASE
  // ===============================
  MONGO_URI: getEnv("MONGO_URI"),

  // ===============================
  // AUTH / JWT (UPDATED – ACCESS + REFRESH)
  // ===============================
  JWT_ACCESS_SECRET: getEnv("JWT_ACCESS_SECRET"),
  JWT_REFRESH_SECRET: getEnv("JWT_REFRESH_SECRET"),

  JWT_ACCESS_EXPIRES_IN:
    getEnv("JWT_ACCESS_EXPIRES_IN", false) || "15m",

  JWT_REFRESH_EXPIRES_IN:
    getEnv("JWT_REFRESH_EXPIRES_IN", false) || "7d",

  // ===============================
  // SECURITY
  // ===============================
  BCRYPT_SALT_ROUNDS: Number(
    getEnv("BCRYPT_SALT_ROUNDS", false) || 10
  ),

// ===============================
// AI (LATER USE)
// ===============================
OPENAI_API_KEY: getEnv("OPENAI_API_KEY", false),
OPENAI_API_BASE_URL: getEnv("OPENAI_API_BASE_URL", false),
OPENAI_MODEL: getEnv("OPENAI_MODEL", false) || "gpt-4o-mini",
};

/**
 * Freeze to avoid runtime mutation
 */
Object.freeze(ENV);
