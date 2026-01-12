import { getRedis, getMemory } from "./cache.client";

export class CacheService {
  static async get<T>(key: string): Promise<T | null> {
    const redis = getRedis();
    if (redis) {
      const data = await redis.get(key);
      return data ? (JSON.parse(data) as T) : null;
    }

    const mem = getMemory();
    const entry = mem.get(key);
    if (!entry) return null;

    if (entry.expiresAt && entry.expiresAt < Date.now()) {
      mem.delete(key);
      return null;
    }

    return entry.value as T;
  }

  static async set<T>(key: string, value: T, ttlSeconds?: number) {
    const redis = getRedis();
    if (redis) {
      const payload = JSON.stringify(value);
      if (ttlSeconds) {
        await redis.set(key, payload, "EX", ttlSeconds);
      } else {
        await redis.set(key, payload);
      }
      return;
    }

    const mem = getMemory();
    mem.set(key, {
      value,
      expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined,
    });
  }

  static async del(key: string) {
    const redis = getRedis();
    if (redis) {
      await redis.del(key);
      return;
    }
    getMemory().delete(key);
  }

  static async invalidateByPattern(pattern: string) {
    const redis = getRedis();
    if (redis) {
      const keys = await redis.keys(pattern);
      if (keys.length) await redis.del(keys);
      return;
    }

    const mem = getMemory();
    for (const key of mem.keys()) {
      if (key.startsWith(pattern.replace("*", ""))) {
        mem.delete(key);
      }
    }
  }
}
