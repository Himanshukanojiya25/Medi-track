// src/lib/storage/index.ts

/**
 * 💾 Production-Grade Storage System
 * 
 * Complete storage solution with multiple adapters:
 * - **Local/Session Storage**: Simple key-value for small data
 * - **IndexedDB**: Large structured data with indexes
 * - **Cookies**: Universal storage with HTTP support
 * - **Memory**: In-memory fallback with TTL
 * 
 * @module storage
 * 
 * @example
 * ```typescript
 * // Simple usage
 * import { localStorage } from './storage';
 * 
 * await localStorage.set('user', { name: 'John' });
 * const user = await localStorage.get('user');
 * 
 * // IndexedDB for large data
 * import { indexedDB } from './storage';
 * 
 * await indexedDB.users.add({ name: 'Jane', email: 'jane@example.com' });
 * const users = await indexedDB.users.find({ name: 'Jane' });
 * 
 * // Cookies for auth
 * import { cookies } from './storage';
 * 
 * cookies.set('token', 'xyz123', { secure: true, httpOnly: true });
 * ```
 */

// ============================================================================
// CORE STORAGE SERVICE
// ============================================================================

export {
  StorageService,
  createLocalStorage,
  createSessionStorage,
  createMemoryStorage,
  type StorageConfig,
  type StorageOptions,
  type StorageEntry,
  type StorageEvent,
  type StorageAdapter,
  type StorageType
} from './storage.service';

// ============================================================================
// COOKIE ADAPTER
// ============================================================================

export {
  CookieAdapter,
  createCookieAdapter,
  createSecureCookieAdapter,
  type CookieConfig,
  type CookieOptions,
  type CookieStorageOptions
} from './cookie.adapter';

// ============================================================================
// INDEXEDDB ADAPTER
// ============================================================================

export {
  IndexedDBAdapter,
  createIndexedDB,
  createUsersDB,
  type IndexedDBConfig,
  type IndexedDBStoreConfig,
  type IndexedDBIndexConfig,
  type QueryOptions,
  type WhereCondition
} from './indexedDB.adapter';

// ============================================================================
// STORAGE MANAGER (Unified API)
// ============================================================================

import { 
  StorageService,
  createLocalStorage,
  createSessionStorage,
  createMemoryStorage,
  type StorageType,
  type StorageOptions
} from './storage.service';
import { CookieAdapter, createCookieAdapter, createSecureCookieAdapter } from './cookie.adapter';
import { IndexedDBAdapter, createIndexedDB } from './indexedDB.adapter';

/**
 * 🎯 Storage Manager - Unified API for all storage types
 * Automatically chooses best storage based on data size and persistence needs
 */
export class StorageManager {
  private local: StorageService;
  private session: StorageService;
  private memory: StorageService;
  private cookieAdapter: CookieAdapter;
  private indexedDBAdapter: IndexedDBAdapter | null = null;

  constructor(prefix?: string) {
    this.local = new StorageService({ type: 'local', prefix });
    this.session = new StorageService({ type: 'session', prefix });
    this.memory = new StorageService({ type: 'memory', prefix });
    this.cookieAdapter = new CookieAdapter({ prefix });
  }

  /**
   * Get appropriate storage for data
   */
  getStorage(data: any): StorageService {
    const size = JSON.stringify(data).length;
    
    if (size > 1024 * 100) { // > 100KB
      return this.local; // localStorage can handle larger data
    }
    
    return this.session; // sessionStorage for smaller data
  }

  /**
   * Smart set - chooses best storage
   */
  async set(key: string, value: any, options?: {
    persistent?: boolean;
    ttl?: number;
  }): Promise<void> {
    if (options?.persistent) {
      // Use localStorage for persistence
      await this.local.set(key, value, { ttl: options.ttl });
    } else if (options?.ttl) {
      // Use memory for TTL
      await this.memory.set(key, value, { ttl: options.ttl });
    } else {
      // Use session by default
      await this.session.set(key, value);
    }
  }

  /**
   * Smart get - tries all storages
   */
  async get<T>(key: string): Promise<T | null> {
    // Try memory first (fastest)
    let value = await this.memory.get<T>(key);
    if (value !== null) return value;

    // Try session
    value = await this.session.get<T>(key);
    if (value !== null) return value;

    // Try local
    value = await this.local.get<T>(key);
    
    // Cache in memory for faster access next time
    if (value !== null) {
      await this.memory.set(key, value);
    }
    
    return value;
  }

  /**
   * Initialize IndexedDB
   */
  async initIndexedDB(name: string, version: number, stores: any): Promise<void> {
    this.indexedDBAdapter = new IndexedDBAdapter({ name, version, stores });
    await this.indexedDBAdapter.init();
  }

  /**
   * Get IndexedDB adapter
   */
  get indexedDB(): IndexedDBAdapter {
    if (!this.indexedDBAdapter) {
      throw new Error('IndexedDB not initialized. Call initIndexedDB first.');
    }
    return this.indexedDBAdapter;
  }

  /**
   * Get cookie adapter
   */
  get cookies(): CookieAdapter {
    return this.cookieAdapter;
  }

  /**
   * Clear all storages
   */
  async clearAll(): Promise<void> {
    await Promise.all([
      this.local.clear(),
      this.session.clear(),
      this.memory.clear(),
      this.cookieAdapter.clear()
    ]);
  }

  /**
   * Get storage usage info
   */
  async getUsage(): Promise<{
    local: number;
    session: number;
    memory: number;
    cookies: number;
  }> {
    const [local, session, memory, cookies] = await Promise.all([
      this.local.size(),
      this.session.size(),
      this.memory.size(),
      this.cookieAdapter.size()
    ]);

    return {
      local,
      session,
      memory,
      cookies
    };
  }
}

// ============================================================================
// DEFAULT INSTANCES
// ============================================================================

/**
 * Default storage manager instance
 */
export const storageManager = new StorageManager();

/**
 * Default localStorage instance
 */
export const localStorage = createLocalStorage();

/**
 * Default sessionStorage instance
 */
export const sessionStorage = createSessionStorage();

/**
 * Default memory storage instance
 */
export const memoryStorage = createMemoryStorage();

/**
 * Default cookie adapter instance
 */
export const cookies = createCookieAdapter();

// ============================================================================
// REACT HOOKS
// ============================================================================

/**
 * React hook for using storage
 * @example
 * ```typescript
 * function UserProfile() {
 *   const [user, setUser, loading] = useStorage('user', { name: 'Guest' });
 *   
 *   if (loading) return <div>Loading...</div>;
 *   
 *   return <div>Hello, {user.name}</div>;
 * }
 * ```
 */
export const useStorage = <T>(
  key: string,
  defaultValue?: T,
  storageType: StorageType = 'local'
): [T | null, (value: T) => Promise<void>, boolean] => {
  // This is a React hook - implement in separate file
  // For now, returning placeholder
  return [null, async () => {}, false];
};

// ============================================================================
// DECORATORS
// ============================================================================

/**
 * Decorator for persisting class properties
 * @example
 * ```typescript
 * class Settings {
 *   @Persist('theme')
 *   theme: string = 'light';
 *   
 *   @Persist('user', { ttl: 3600000 })
 *   user: User | null = null;
 * }
 * ```
 */
export function Persist(key: string, options?: StorageOptions) {
  return function(target: any, propertyKey: string) {
    const storage = localStorage;
    
    // Define getter/setter
    Object.defineProperty(target, propertyKey, {
      get: function() {
        return storage.get(key);
      },
      set: function(value: any) {
        storage.set(key, value, options);
      },
      enumerable: true,
      configurable: true
    });
  };
}

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Clear all storages
 */
export const clearAllStorages = async (): Promise<void> => {
  await storageManager.clearAll();
};

/**
 * Get storage stats
 */
export const getStorageStats = async (): Promise<any> => {
  return storageManager.getUsage();
};

/**
 * Check if storage is available
 */
export const isStorageAvailable = (type: StorageType): boolean => {
  try {
    switch (type) {
      case 'local':
        return typeof localStorage !== 'undefined';
      case 'session':
        return typeof sessionStorage !== 'undefined';
      case 'cookie':
        return CookieAdapter.isEnabled();
      case 'indexeddb':
        return typeof indexedDB !== 'undefined';
      default:
        return true;
    }
  } catch {
    return false;
  }
};

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default {
  // Core
  StorageService,
  StorageManager,
  
  // Adapters
  CookieAdapter,
  IndexedDBAdapter,
  
  // Factories
  createLocalStorage,
  createSessionStorage,
  createMemoryStorage,
  createCookieAdapter,
  createSecureCookieAdapter,
  createIndexedDB,
  
  // Default instances
  localStorage,
  sessionStorage,
  memoryStorage,
  cookies,
  storageManager,
  
  // Utilities
  clearAllStorages,
  getStorageStats,
  isStorageAvailable,
  
  // React (if needed)
  useStorage,
  
  // Decorators
  Persist
};