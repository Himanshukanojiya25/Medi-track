import Redis from "ioredis";

const USE_REDIS = process.env.USE_REDIS === "true";

let redis: Redis | null = null;

// Simple in-memory fallback
const memoryStore = new Map<string, { value: any; expiresAt?: number }>();

export function initCacheClient() {
  if (!USE_REDIS) return;

  if (!redis) {
    redis = new Redis(process.env.REDIS_URL as string, {
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
    });
  }
}

export function getRedis() {
  return redis;
}

export function getMemory() {
  return memoryStore;
}

export function closeCacheClient() {
  if (redis) redis.disconnect();
}
