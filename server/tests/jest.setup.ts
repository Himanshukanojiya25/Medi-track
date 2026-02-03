import mongoose from "mongoose";
import { ENV } from "../src/config/env";

beforeAll(async () => {
  /**
   * Jest controls DB lifecycle
   * DO NOT import app-level mongoose config here
   */
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(ENV.MONGO_URI);
  }
});

/**
 * NOTE:
 * No afterEach cleanup intentionally
 * (existing tests rely on beforeAll-created data)
 */

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
});
