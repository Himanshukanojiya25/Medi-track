/**
 * Retries an async function with backoff
 * - Explicit retry count
 * - Optional delay strategy
 */
export async function retry<T>(
  operation: () => Promise<T>,
  options?: {
    retries?: number;
    delayMs?: number;
    backoffMultiplier?: number;
  }
): Promise<T> {
  if (typeof operation !== "function") {
    throw new Error("retry expects a function");
  }

  const {
    retries = 3,
    delayMs = 300,
    backoffMultiplier = 2,
  } = options || {};

  let attempt = 0;
  let currentDelay = delayMs;

  while (true) {
    try {
      return await operation();
    } catch (error) {
      attempt++;

      if (attempt > retries) {
        throw error;
      }

      await new Promise((res) => setTimeout(res, currentDelay));
      currentDelay *= backoffMultiplier;
    }
  }
}
