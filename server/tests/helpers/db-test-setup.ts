import { connectDB, disconnectDB } from "../../src/config";

/**
 * ==========================
 * TEST DB HELPERS (ALIASES)
 * ==========================
 * Naming matches existing test infra
 */

export async function connectTestDB(): Promise<void> {
  await connectDB();
}

export async function clearTestDB(): Promise<void> {
  // Optional: collections clear logic
  // If you already clear DB elsewhere, keep empty
}

export async function disconnectTestDB(): Promise<void> {
  await disconnectDB();
}

/**
 * Backward compatibility (optional)
 */
export async function setupTestDB(): Promise<void> {
  await connectTestDB();
}

export async function teardownTestDB(): Promise<void> {
  await disconnectTestDB();
}
