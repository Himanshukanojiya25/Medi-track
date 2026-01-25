import mongoose from "mongoose";
import { connectDB, disconnectDB } from "../src/config/mongoose";

beforeAll(async () => {
  // Always ensure connection before any test
  if (mongoose.connection.readyState !== 1) {
    await connectDB();
  }
});

/**
 * ❌ NO afterEach cleanup
 * Kyunki bohot se tests beforeAll me data create karte hain
 */

/**
 * ❌ NO deleteMany in afterAll
 * Ye hi MongoNotConnectedError ka root cause tha
 */

afterAll(async () => {
  // Sirf safely disconnect
  if (mongoose.connection.readyState === 1) {
    await disconnectDB();
  }
});
