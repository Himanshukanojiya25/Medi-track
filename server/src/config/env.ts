import dotenv from "dotenv";

dotenv.config();

function getEnv(key: string, required = true): string | undefined {
  const value = process.env[key];

  if (!value && required) {
    throw new Error(
      `[ENV ERROR] Missing required environment variable: ${key}`
    );
  }

  return value;
}

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
  // REDIS (OPTIONAL)
  // ===============================
  REDIS_HOST: getEnv("REDIS_HOST", false),
  REDIS_PORT: Number(getEnv("REDIS_PORT", false) ?? 6379),
  REDIS_PASSWORD: getEnv("REDIS_PASSWORD", false),
  REDIS_DB: Number(getEnv("REDIS_DB", false) ?? 0),

  // ===============================
  // AI (OPTIONAL – FREE MODE SAFE)
  // ===============================
  OPENAI_API_KEY: getEnv("OPENAI_API_KEY", false),

  // 🔥 THIS WAS MISSING
  OPENAI_API_BASE_URL: getEnv("OPENAI_API_BASE_URL", false),

  OPENAI_MODEL:
    getEnv("OPENAI_MODEL", false) ?? "gpt-4o-mini",
};

Object.freeze(ENV);
