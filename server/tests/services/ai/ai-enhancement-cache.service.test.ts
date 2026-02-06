import { AIEnhancementCacheService } from "../../../src/services/ai/ai-enhancement-cache.service";
import { AIEnhancementResult } from "../../../src/types/ai/ai-enhancement.types";

describe("AIEnhancementCacheService", () => {
  const key = "test:cache:key";

  const value: AIEnhancementResult = {
    enhancedMessage: "Enhanced message",
    explanation: "Explanation text",
    confidenceScore: 0.9,
    language: "en",
  };

  beforeEach(async () => {
    await AIEnhancementCacheService.clear();
  });

  it("should return null when cache is empty", async () => {
    const result = await AIEnhancementCacheService.get(key);
    expect(result).toBeNull();
  });

  it("should store and retrieve cached value", async () => {
    await AIEnhancementCacheService.set(key, value);

    const result = await AIEnhancementCacheService.get(key);
    expect(result).toEqual(value);
  });

  it("should invalidate a cache key", async () => {
    await AIEnhancementCacheService.set(key, value);

    await AIEnhancementCacheService.invalidate(key);
    const result = await AIEnhancementCacheService.get(key);

    expect(result).toBeNull();
  });

  it("should clear entire cache", async () => {
    await AIEnhancementCacheService.set(key, value);

    await AIEnhancementCacheService.clear();
    const result = await AIEnhancementCacheService.get(key);

    expect(result).toBeNull();
  });

  it("should respect TTL and expire entries", async () => {
    jest.useFakeTimers();

    await AIEnhancementCacheService.set(key, value);

    // Fast-forward beyond TTL (1 hour)
    jest.advanceTimersByTime(60 * 60 * 1000 + 1);

    const result = await AIEnhancementCacheService.get(key);
    expect(result).toBeNull();

    jest.useRealTimers();
  });
});
