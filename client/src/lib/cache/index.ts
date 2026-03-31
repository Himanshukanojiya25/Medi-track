/**
 * @fileoverview Cache Module - Main Entry Point
 * @module lib/cache
 * @description Centralized cache system with multiple storage backends
 * 
 * @example
 * ```typescript
 * // Simple usage
 * import { cache } from '../../lib/cache';
 * 
 * await cache.set('user:123', userData, { ttl: 3600 });
 * const user = await cache.get('user:123');
 * 
 * // Custom cache with localStorage
 * import { createCache, LocalStorageAdapter } from '../../lib/cache';
 * 
 * const persistentCache = createCache({
 *   storage: new LocalStorageAdapter({
 *     prefix: 'app:',
 *     enableCompression: true
 *   })
 * });
 * ```
 * 
 * @version 2.0.0
 */

// ============================================================================
// MAIN CACHE EXPORTS
// ============================================================================

export {
  cache,
  createCache,
  Cache,
  type CacheType
} from './cache.service';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type {
  CacheConfig,
  CacheItem,
  CacheStats,
  CacheSetOptions,
  CacheGetOptions,
  CacheStorage
} from './cache.service';

// ============================================================================
// STORAGE ADAPTERS
// ============================================================================

export {
  MemoryStorage,
  LocalStorageBackend,
  SessionStorageBackend
} from './cache.service';

export {
  LocalStorageAdapter,
  createLocalStorageAdapter,
  type LocalStorageAdapterConfig,
  type StorageInfo
} from './localStorage.adapter';

export {
  SessionStorageAdapter,
  createSessionStorageAdapter,
  type SessionStorageAdapterConfig,
  type SessionInfo
} from './sessionStorage.adapter';

// ============================================================================
// RE-EXPORT DEFAULT
// ============================================================================

export { default } from './cache.service';

// ============================================================================
// IMPORTS FOR UTILITY FUNCTIONS
// ============================================================================

import { createCache, MemoryStorage } from './cache.service';
import { LocalStorageAdapter } from './localStorage.adapter';
import { SessionStorageAdapter } from './sessionStorage.adapter';
import type { LocalStorageAdapterConfig } from './localStorage.adapter';
import type { SessionStorageAdapterConfig } from './sessionStorage.adapter';
import { cache } from './cache.service';

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Create a memory-based cache (fastest, non-persistent)
 */
export const createMemoryCache = (maxSize: number = 1000) => {
  return createCache({
    storage: new MemoryStorage(maxSize),
    defaultTTL: 3600,
    enableStats: true
  });
};

/**
 * Create a localStorage-based cache (persistent across sessions)
 */
export const createLocalStorageCache = (config?: Partial<LocalStorageAdapterConfig>) => {
  return createCache({
    storage: new LocalStorageAdapter({
      prefix: 'app_cache:',
      enableCompression: true,
      ...config
    }),
    defaultTTL: 3600,
    enableStats: true
  });
};

/**
 * Create a sessionStorage-based cache (persistent only for session)
 */
export const createSessionStorageCache = (config?: Partial<SessionStorageAdapterConfig>) => {
  return createCache({
    storage: new SessionStorageAdapter({
      prefix: 'app_session:',
      enableCompression: true,
      ...config
    }),
    defaultTTL: 1800, // 30 minutes default for sessions
    enableStats: true
  });
};

// ============================================================================
// CACHE PRESETS
// ============================================================================

/**
 * Preset cache configurations for common use cases
 */
export const CachePresets = {
  /**
   * Fast in-memory cache for frequently accessed data
   */
  memory: () => createMemoryCache(500),

  /**
   * Persistent cache for user preferences and settings
   */
  userSettings: () => createLocalStorageCache({
    prefix: 'user_settings:',
    enableCompression: false, // Settings are usually small
    maxSize: 1024 * 1024 // 1MB
  }),

  /**
   * Session cache for temporary data (cart, form data, etc.)
   */
  session: () => createSessionStorageCache({
    prefix: 'session:',
    enableCompression: true,
    enableTabSync: false
  }),

  /**
   * API response cache with compression
   */
  api: () => createLocalStorageCache({
    prefix: 'api_cache:',
    enableCompression: true,
    maxSize: 10 * 1024 * 1024, // 10MB
    quotaWarningThreshold: 85
  }),

  /**
   * Large data cache with aggressive compression
   */
  largeData: () => createLocalStorageCache({
    prefix: 'large_data:',
    enableCompression: true,
    enableEncryption: false,
    maxSize: 15 * 1024 * 1024 // 15MB
  })
};

// ============================================================================
// CACHE MANAGER (Multi-Layer Caching)
// ============================================================================

/**
 * Multi-layer cache manager
 * Tries memory first, then localStorage, with automatic promotion
 */
export class CacheManager {
  private memoryCache: ReturnType<typeof createMemoryCache>;
  private persistentCache: ReturnType<typeof createLocalStorageCache>;

  constructor() {
    this.memoryCache = createMemoryCache(200);
    this.persistentCache = createLocalStorageCache({
      prefix: 'app_l2:',
      enableCompression: true
    });
  }

  /**
   * Get from cache (checks memory first, then persistent)
   */
  async get<T>(key: string): Promise<T | null> {
    // L1: Memory cache (fastest)
    let value = await this.memoryCache.get<T>(key);
    if (value !== null) {
      return value;
    }

    // L2: Persistent cache
    value = await this.persistentCache.get<T>(key);
    if (value !== null) {
      // Promote to memory cache
      await this.memoryCache.set(key, value, { ttl: 300 }); // 5 min in memory
      return value;
    }

    return null;
  }

  /**
   * Set in both caches
   */
  async set<T>(key: string, value: T, options?: { ttl?: number; persistentOnly?: boolean }): Promise<void> {
    // Always set in persistent cache
    await this.persistentCache.set(key, value, { ttl: options?.ttl });

    // Set in memory cache unless persistentOnly
    if (!options?.persistentOnly) {
      const memoryTTL = Math.min(options?.ttl || 300, 300); // Max 5 min in memory
      await this.memoryCache.set(key, value, { ttl: memoryTTL });
    }
  }

  /**
   * Delete from both caches
   */
  async delete(key: string): Promise<void> {
    await Promise.all([
      this.memoryCache.delete(key),
      this.persistentCache.delete(key)
    ]);
  }

  /**
   * Clear both caches
   */
  async clear(): Promise<void> {
    await Promise.all([
      this.memoryCache.clear(),
      this.persistentCache.clear()
    ]);
  }

  /**
   * Get combined stats
   */
  getStats() {
    return {
      memory: this.memoryCache.getStats(),
      persistent: this.persistentCache.getStats()
    };
  }
}

/**
 * Global multi-layer cache instance
 */
export const cacheManager = new CacheManager();

// ============================================================================
// CACHE DECORATORS (Optional - for class methods)
// ============================================================================

/**
 * Decorator to cache method results
 * 
 * @example
 * ```typescript
 * class UserService {
 *   @Cached({ ttl: 300, key: (userId) => `user:${userId}` })
 *   async getUser(userId: string) {
 *     return await fetchUser(userId);
 *   }
 * }
 * ```
 */
export function Cached(options: {
  ttl?: number;
  key?: (...args: any[]) => string;
  cache?: ReturnType<typeof createCache>;
}) {
  return function (
    _target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    const cacheInstance = options.cache || cache;

    descriptor.value = async function (...args: any[]) {
      // Generate cache key
      const cacheKey = options.key
        ? options.key(...args)
        : `${_propertyKey}:${JSON.stringify(args)}`;

      // Try to get from cache
      const cached = await cacheInstance.get(cacheKey);
      if (cached !== null) {
        return cached;
      }

      // Execute original method
      const result = await originalMethod.apply(this, args);

      // Cache the result
      await cacheInstance.set(cacheKey, result, { ttl: options.ttl });

      return result;
    };

    return descriptor;
  };
}

/**
 * Decorator to invalidate cache on method call
 * 
 * @example
 * ```typescript
 * class UserService {
 *   @InvalidateCache({ key: (userId) => `user:${userId}` })
 *   async updateUser(userId: string, data: any) {
 *     return await updateUserAPI(userId, data);
 *   }
 * }
 * ```
 */
export function InvalidateCache(options: {
  key?: (...args: any[]) => string | string[];
  cache?: ReturnType<typeof createCache>;
}) {
  return function (
    _target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    const cacheInstance = options.cache || cache;

    descriptor.value = async function (...args: any[]) {
      // Execute original method first
      const result = await originalMethod.apply(this, args);

      // Invalidate cache keys
      if (options.key) {
        const keys = options.key(...args);
        const keysArray = Array.isArray(keys) ? keys : [keys];
        
        await Promise.all(
          keysArray.map(key => cacheInstance.delete(key))
        );
      }

      return result;
    };

    return descriptor;
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Memoize a function with caching
 */
export const memoize = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options?: {
    ttl?: number;
    keyGenerator?: (...args: Parameters<T>) => string;
    cache?: ReturnType<typeof createCache>;
  }
): T => {
  const cacheInstance = options?.cache || cache;
  const keyGenerator = options?.keyGenerator || ((...args) => JSON.stringify(args));

  return (async (...args: Parameters<T>) => {
    const key = `memoize:${fn.name}:${keyGenerator(...args)}`;
    
    return await cacheInstance.remember(
      key,
      () => fn(...args),
      { ttl: options?.ttl }
    );
  }) as T;
};

/**
 * Cache a promise to prevent duplicate requests
 */
const pendingPromises = new Map<string, Promise<any>>();

export const cacheDedupe = async <T>(
  key: string,
  fn: () => Promise<T>,
  options?: { ttl?: number }
): Promise<T> => {
  // Check cache first
  const cached = await cache.get<T>(key);
  if (cached !== null) {
    return cached;
  }

  // Check if request is already pending
  if (pendingPromises.has(key)) {
    return pendingPromises.get(key)!;
  }

  // Execute and cache the promise
  const promise = fn().then(async (result) => {
    await cache.set(key, result, { ttl: options?.ttl });
    pendingPromises.delete(key);
    return result;
  }).catch((error) => {
    pendingPromises.delete(key);
    throw error;
  });

  pendingPromises.set(key, promise);
  return promise;
};

/**
 * Batch get multiple keys efficiently
 */
export const batchGet = async <T>(
  keys: string[],
  options?: {
    cache?: ReturnType<typeof createCache>;
  }
): Promise<Map<string, T>> => {
  const cacheInstance = options?.cache || cache;
  return await cacheInstance.getMany<T>(keys);
};

/**
 * Batch set multiple keys efficiently
 */
export const batchSet = async <T>(
  items: Record<string, T>,
  options?: {
    ttl?: number;
    cache?: ReturnType<typeof createCache>;
  }
): Promise<void> => {
  const cacheInstance = options?.cache || cache;
  const itemsMap = new Map(Object.entries(items));
  await cacheInstance.setMany(itemsMap, { ttl: options?.ttl });
};

// ============================================================================
// CACHE WARMING UTILITIES
// ============================================================================

/**
 * Warm up cache with data
 */
export const warmCache = async <T>(
  dataLoader: () => Promise<Record<string, T>>,
  options?: {
    ttl?: number;
    cache?: ReturnType<typeof createCache>;
  }
): Promise<void> => {
  const data = await dataLoader();
  await batchSet(data, options);
  console.log(`[Cache] Warmed ${Object.keys(data).length} items`);
};

/**
 * Prefetch cache keys
 */
export const prefetchCache = async (
  keys: string[],
  dataLoader: (key: string) => Promise<any>,
  options?: {
    ttl?: number;
    concurrency?: number;
    cache?: ReturnType<typeof createCache>;
  }
): Promise<void> => {
  const cacheInstance = options?.cache || cache;
  const concurrency = options?.concurrency || 5;
  const chunks = [];

  // Split into chunks
  for (let i = 0; i < keys.length; i += concurrency) {
    chunks.push(keys.slice(i, i + concurrency));
  }

  // Process chunks
  for (const chunk of chunks) {
    await Promise.all(
      chunk.map(async (key) => {
        const exists = await cacheInstance.has(key);
        if (!exists) {
          const data = await dataLoader(key);
          await cacheInstance.set(key, data, { ttl: options?.ttl });
        }
      })
    );
  }

  console.log(`[Cache] Prefetched ${keys.length} items`);
};

// ============================================================================
// DEBUG UTILITIES
// ============================================================================

/**
 * Log cache statistics
 */
export const logCacheStats = (label: string = 'Cache Stats'): void => {
  const stats = cache.getStats();
  console.group(`📊 ${label}`);
  console.log(`Hits: ${stats.hits}`);
  console.log(`Misses: ${stats.misses}`);
  console.log(`Hit Rate: ${stats.hitRate}%`);
  console.log(`Sets: ${stats.sets}`);
  console.log(`Deletes: ${stats.deletes}`);
  console.log(`Size: ${stats.size}`);
  console.groupEnd();
};

/**
 * Clear all caches (useful for debugging)
 */
export const clearAllCaches = async (): Promise<void> => {
  await Promise.all([
    cache.clear(),
    cacheManager.clear()
  ]);
  console.log('[Cache] All caches cleared');
};

// ============================================================================
// TYPE GUARDS
// ============================================================================

export const isCacheHit = <T>(value: T | null): value is T => {
  return value !== null;
};

export const isCacheMiss = <T>(value: T | null): value is null => {
  return value === null;
};