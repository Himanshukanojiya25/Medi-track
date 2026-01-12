import { connectDB, disconnectDB } from "../../src/config";

export async function setupTestDB(): Promise<void> {
  await connectDB();
}

export async function teardownTestDB(): Promise<void> {
  await disconnectDB();
}
