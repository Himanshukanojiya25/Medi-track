import mongoose from "mongoose";
import { DB_CONFIG } from "./db";
import { ENV } from "./env";

let isConnected = false;

/**
 * Connect to MongoDB
 * Safe to call multiple times (idempotent)
 */
export async function connectDB(): Promise<void> {
  if (isConnected) {
    return;
  }

  let attempts = 0;

  while (attempts < DB_CONFIG.retry.MAX_RETRIES) {
    try {
      await mongoose.connect(DB_CONFIG.uri, DB_CONFIG.options);
      isConnected = true;

      console.log(`[DB] Connected to MongoDB (${ENV.NODE_ENV})`);
      return;
    } catch (error) {
      attempts++;

      console.error(
        `[DB] Connection attempt ${attempts} failed`,
        error
      );

      if (attempts >= DB_CONFIG.retry.MAX_RETRIES) {
        console.error("[DB] Max retries reached. Exiting process.");
        process.exit(1);
      }

      await new Promise((resolve) =>
        setTimeout(resolve, DB_CONFIG.retry.RETRY_DELAY_MS)
      );
    }
  }
}

/**
 * Graceful DB disconnect
 * Used in tests and shutdown hooks
 */
export async function disconnectDB(): Promise<void> {
  if (!isConnected) return;

  await mongoose.disconnect();
  isConnected = false;

  console.log("[DB] Disconnected from MongoDB");
}

/**
 * --------------------
 * MONGOOSE EVENT HOOKS
 * --------------------
 */
mongoose.connection.on("connected", () => {
  if (ENV.NODE_ENV !== "test") {
    console.log("[DB] Mongoose connection established");
  }
});

mongoose.connection.on("error", (err) => {
  console.error("[DB] Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  if (ENV.NODE_ENV !== "test") {
    console.log("[DB] Mongoose disconnected");
  }
});

/**
 * --------------------
 * GLOBAL MONGOOSE CONFIG
 * --------------------
 */
mongoose.set("strictQuery", true);
