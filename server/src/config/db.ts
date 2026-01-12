import { ENV } from "./env";
import type { ConnectOptions } from "mongoose";

/**
 * MongoDB connection options
 * Kept separate from actual connection logic
 */
export const DB_OPTIONS: ConnectOptions = {
  autoIndex: ENV.NODE_ENV !== "production",
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4,
};

/**
 * Retry strategy for DB connection
 */
export const DB_RETRY_CONFIG = {
  MAX_RETRIES: 5,
  RETRY_DELAY_MS: 3000,
};

/**
 * Database configuration object
 */
export const DB_CONFIG = {
  uri: ENV.MONGO_URI,
  options: DB_OPTIONS,
  retry: DB_RETRY_CONFIG,
};
