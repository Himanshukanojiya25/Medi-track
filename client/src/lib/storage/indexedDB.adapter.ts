// src/lib/storage/indexedDB.adapter.ts

/**
 * 📀 IndexedDB Storage Adapter
 * ✅ Large data storage (GBs)
 * ✅ Structured data with indexes
 * ✅ Transaction support
 * ✅ Blob/File storage
 * ✅ Offline-first apps
 * 
 * @example
 * ```typescript
 * const db = new IndexedDBAdapter('myapp', 1, {
 *   users: '++id, name, email',
 *   posts: '++id, title, userId'
 * });
 * await db.init();
 * await db.users.add({ name: 'John', email: 'john@example.com' });
 * ```
 */

// ================ TYPES ================

export interface IndexedDBConfig {
  name: string;
  version: number;
  stores: Record<string, string | IndexedDBStoreConfig>;
  migrate?: (db: IDBDatabase, oldVersion: number, newVersion: number) => Promise<void>;
}

export interface IndexedDBStoreConfig {
  keyPath?: string | string[];
  autoIncrement?: boolean;
  indexes: Record<string, string | IndexedDBIndexConfig>;
}

export interface IndexedDBIndexConfig {
  keyPath: string | string[];
  unique?: boolean;
  multiEntry?: boolean;
}

export interface QueryOptions {
  index?: string;
  limit?: number;
  offset?: number;
  direction?: 'next' | 'prev' | 'nextunique' | 'prevunique';
}

export interface WhereCondition {
  field: string;
  operator: '==' | '!=' | '>' | '<' | '>=' | '<=' | 'between' | 'like' | 'in';
  value: any;
  value2?: any; // for 'between'
}

// ================ MAIN INDEXEDDB ADAPTER ================

export class IndexedDBAdapter {
  private db: IDBDatabase | null = null;
  private config: IndexedDBConfig;
  private initPromise: Promise<void> | null = null;
  private stores: Map<string, IDBObjectStore> = new Map();

  constructor(config: IndexedDBConfig) {
    this.config = config;
  }

  /**
   * Initialize database
   */
  async init(): Promise<void> {
    if (this.initPromise) return this.initPromise;
    
    this.initPromise = new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        reject(new Error('IndexedDB not available'));
        return;
      }

      const request = indexedDB.open(this.config.name, this.config.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        this.setupStores();
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = request.result;
        const oldVersion = event.oldVersion;
        const newVersion = event.newVersion || this.config.version;

        // Create/upgrade stores
        this.createStores(db);

        // Run migration if provided
        if (this.config.migrate) {
          this.config.migrate(db, oldVersion, newVersion).catch(reject);
        }
      };
    });

    return this.initPromise;
  }

  private createStores(db: IDBDatabase): void {
    Object.entries(this.config.stores).forEach(([storeName, storeConfig]) => {
      // Delete existing store if version changed
      if (db.objectStoreNames.contains(storeName)) {
        db.deleteObjectStore(storeName);
      }

      // Parse store configuration
      let keyPath: string | string[] = 'id';
      let autoIncrement = true;
      let indexes: Record<string, string | IndexedDBIndexConfig> = {};

      if (typeof storeConfig === 'string') {
        // Parse string format: "++id, name, email"
        const parts = storeConfig.split(',').map(p => p.trim());
        indexes = {};
        
        parts.forEach(part => {
          if (part.startsWith('++')) {
            keyPath = part.substring(2);
            autoIncrement = true;
          } else if (part.startsWith('&')) {
            const indexName = part.substring(1);
            indexes[indexName] = { keyPath: indexName, unique: true };
          } else if (part.startsWith('*')) {
            const indexName = part.substring(1);
            indexes[indexName] = { keyPath: indexName, multiEntry: true };
          } else if (part) {
            indexes[part] = part;
          }
        });
      } else {
        keyPath = storeConfig.keyPath || 'id';
        autoIncrement = storeConfig.autoIncrement ?? true;
        indexes = storeConfig.indexes;
      }

      // Create object store
      const objectStore = db.createObjectStore(storeName, {
        keyPath,
        autoIncrement
      });

      // Create indexes
      Object.entries(indexes).forEach(([indexName, indexConfig]) => {
        if (typeof indexConfig === 'string') {
          objectStore.createIndex(indexName, indexConfig, { unique: false });
        } else {
          objectStore.createIndex(
            indexName,
            indexConfig.keyPath,
            {
              unique: indexConfig.unique,
              multiEntry: indexConfig.multiEntry
            }
          );
        }
      });
    });
  }

  private setupStores(): void {
    if (!this.db) return;
    
    Array.from(this.db.objectStoreNames).forEach(storeName => {
      const transaction = this.db!.transaction(storeName, 'readonly');
      this.stores.set(storeName, transaction.objectStore(storeName));
    });
  }

  private async withStore<T>(
    storeName: string,
    mode: IDBTransactionMode,
    callback: (store: IDBObjectStore) => IDBRequest<T> | IDBRequest<T>[] | Promise<T>
  ): Promise<T> {
    await this.init();

    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, mode);
      const store = transaction.objectStore(storeName);

      transaction.oncomplete = () => resolve(undefined as T);
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(new Error('Transaction aborted'));

      try {
        const result = callback(store);
        
        if (result instanceof Promise) {
          result.then(resolve).catch(reject);
        } else if (result instanceof IDBRequest) {
          result.onsuccess = () => resolve(result.result);
          result.onerror = () => reject(result.error);
        } else if (Array.isArray(result)) {
          Promise.all(result.map(r => 
            new Promise((res, rej) => {
              r.onsuccess = () => res(r.result);
              r.onerror = () => rej(r.error);
            })
          )).then(results => resolve(results as T)).catch(reject);
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  // ================ CRUD OPERATIONS ================

  /**
   * Add a record
   */
  async add<T>(storeName: string, data: T): Promise<IDBValidKey> {
    return this.withStore(storeName, 'readwrite', (store) => {
      return store.add(data);
    });
  }

  /**
   * Get a record by key
   */
  async get<T>(storeName: string, key: IDBValidKey): Promise<T | null> {
    return this.withStore(storeName, 'readonly', (store) => {
      return store.get(key);
    });
  }

  /**
   * Get all records
   */
  async getAll<T>(storeName: string, options?: QueryOptions): Promise<T[]> {
    return this.withStore(storeName, 'readonly', (store) => {
      if (options?.index) {
        const index = store.index(options.index);
        const range = this.createKeyRange(options);
        const request = index.openCursor(range, options?.direction);
        return this.cursorToArray<T>(request);
      }
      
      const range = this.createKeyRange(options);
      const request = store.openCursor(range, options?.direction);
      return this.cursorToArray<T>(request);
    });
  }

  /**
   * Put (update/insert) a record
   */
  async put<T>(storeName: string, data: T): Promise<IDBValidKey> {
    return this.withStore(storeName, 'readwrite', (store) => {
      return store.put(data);
    });
  }

  /**
   * Delete a record
   */
  async delete(storeName: string, key: IDBValidKey): Promise<void> {
    return this.withStore(storeName, 'readwrite', (store) => {
      return store.delete(key);
    });
  }

  /**
   * Clear all records from store
   */
  async clear(storeName: string): Promise<void> {
    return this.withStore(storeName, 'readwrite', (store) => {
      return store.clear();
    });
  }

  /**
   * Count records
   */
  async count(storeName: string, key?: IDBValidKey | IDBKeyRange): Promise<number> {
    return this.withStore(storeName, 'readonly', (store) => {
      if (key) {
        return store.count(key);
      }
      return store.count();
    });
  }

  // ================ QUERY METHODS ================

  /**
   * Find records by conditions
   */
  async find<T>(storeName: string, conditions: WhereCondition[], options?: QueryOptions): Promise<T[]> {
    return this.withStore(storeName, 'readonly', (store) => {
      let index: IDBIndex | null = null;
      
      // Try to use index if available
      if (conditions.length === 1 && conditions[0].operator === '==') {
        const condition = conditions[0];
        const possibleIndex = Array.from(store.indexNames).find(name => 
          name === condition.field || name.startsWith(condition.field)
        );
        
        if (possibleIndex) {
          index = store.index(possibleIndex);
        }
      }

      const request = index 
        ? index.openCursor() 
        : store.openCursor();

      return new Promise((resolve, reject) => {
        const results: T[] = [];
        let skipped = 0;

        request.onsuccess = (event) => {
          const cursor = (event.target as IDBRequest).result;
          
          if (cursor) {
            let matches = true;
            
            // Apply conditions
            for (const condition of conditions) {
              if (!this.evaluateCondition(cursor.value, condition)) {
                matches = false;
                break;
              }
            }

            if (matches) {
              if (options?.offset && skipped < options.offset) {
                skipped++;
              } else {
                results.push(cursor.value);
              }
            }

            if (options?.limit && results.length >= options.limit) {
              resolve(results);
            } else {
              cursor.continue();
            }
          } else {
            resolve(results);
          }
        };

        request.onerror = () => reject(request.error);
      });
    });
  }

  /**
   * Find one record
   */
  async findOne<T>(storeName: string, conditions: WhereCondition[]): Promise<T | null> {
    const results = await this.find<T>(storeName, conditions, { limit: 1 });
    return results[0] || null;
  }

  /**
   * Update records by condition
   */
  async updateMany<T>(
    storeName: string, 
    conditions: WhereCondition[], 
    updates: Partial<T>
  ): Promise<number> {
    const records = await this.find<T>(storeName, conditions);
    
    return this.withStore(storeName, 'readwrite', (store) => {
      const requests = records.map(record => {
        const updated = { ...record, ...updates };
        return store.put(updated);
      });
      return Promise.all(requests);
    }).then(() => records.length);
  }

  /**
   * Delete records by condition
   */
  async deleteMany(storeName: string, conditions: WhereCondition[]): Promise<number> {
    const records = await this.find(storeName, conditions);
    
    await this.withStore(storeName, 'readwrite', (store) => {
      const requests = records.map(record => {
        const key = (record as any)[this.getKeyPath(storeName)];
        return store.delete(key);
      });
      
      return Promise.all(requests);
    });

    return records.length;
  }

  // ================ BATCH OPERATIONS ================

  /**
   * Bulk add records
   */
  async bulkAdd<T>(storeName: string, items: T[]): Promise<IDBValidKey[]> {
    return this.withStore(storeName, 'readwrite', (store) => {
      return new Promise<IDBValidKey[]>((resolve, reject) => {
        const requests = items.map(item => store.add(item));
        const results: IDBValidKey[] = [];
        let completed = 0;

        requests.forEach((request, index) => {
          request.onsuccess = () => {
            results[index] = request.result;
            completed++;
            if (completed === requests.length) {
              resolve(results);
            }
          };
          request.onerror = () => reject(request.error);
        });
      });
    });
  }

  /**
   * Bulk put records
   */
  async bulkPut<T>(storeName: string, items: T[]): Promise<IDBValidKey[]> {
    return this.withStore(storeName, 'readwrite', (store) => {
      return new Promise<IDBValidKey[]>((resolve, reject) => {
        const requests = items.map(item => store.put(item));
        const results: IDBValidKey[] = [];
        let completed = 0;

        requests.forEach((request, index) => {
          request.onsuccess = () => {
            results[index] = request.result;
            completed++;
            if (completed === requests.length) {
              resolve(results);
            }
          };
          request.onerror = () => reject(request.error);
        });
      });
    });
  }

  /**
   * Bulk delete records
   */
  async bulkDelete(storeName: string, keys: IDBValidKey[]): Promise<void> {
    return this.withStore(storeName, 'readwrite', (store) => {
      return new Promise<void>((resolve, reject) => {
        let completed = 0;
        if (keys.length === 0) {
          resolve();
          return;
        }
        keys.forEach(key => {
          const req = store.delete(key);
          req.onsuccess = () => {
            completed++;
            if (completed === keys.length) resolve();
          };
          req.onerror = () => reject(req.error);
        });
      });
    });
  }

  // ================ UTILITIES ================

  private createKeyRange(options?: QueryOptions): IDBKeyRange | undefined {
    // Implement key range creation based on options
    return undefined;
  }

  private cursorToArray<T>(request: IDBRequest<IDBCursorWithValue | null>): Promise<T[]> {
    return new Promise((resolve, reject) => {
      const results: T[] = [];

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        
        if (cursor) {
          results.push(cursor.value);
          cursor.continue();
        } else {
          resolve(results);
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  private evaluateCondition(value: any, condition: WhereCondition): boolean {
    const fieldValue = condition.field.split('.').reduce((obj, key) => obj?.[key], value);
    
    switch (condition.operator) {
      case '==': return fieldValue == condition.value;
      case '!=': return fieldValue != condition.value;
      case '>': return fieldValue > condition.value;
      case '<': return fieldValue < condition.value;
      case '>=': return fieldValue >= condition.value;
      case '<=': return fieldValue <= condition.value;
      case 'between': return fieldValue >= condition.value && fieldValue <= condition.value2;
      case 'like': return String(fieldValue).includes(condition.value);
      case 'in': return condition.value.includes(fieldValue);
      default: return true;
    }
  }

  private getKeyPath(storeName: string): string {
    const config = this.config.stores[storeName];
    if (typeof config === 'string') {
      const match = config.match(/\+?\+?(\w+)/);
      return match ? match[1] : 'id';
    }
    return Array.isArray(config.keyPath) ? config.keyPath[0] : config.keyPath || 'id';
  }

  /**
   * Get database info
   */
  async getInfo(): Promise<{
    name: string;
    version: number;
    stores: string[];
    recordCounts: Record<string, number>;
  }> {
    await this.init();
    
    const recordCounts: Record<string, number> = {};
    
    for (const storeName of this.stores.keys()) {
      recordCounts[storeName] = await this.count(storeName);
    }

    return {
      name: this.config.name,
      version: this.config.version,
      stores: Array.from(this.stores.keys()),
      recordCounts
    };
  }

  /**
   * Export database to JSON
   */
  async export(): Promise<Record<string, any[]>> {
    await this.init();
    
    const data: Record<string, any[]> = {};
    
    for (const storeName of this.stores.keys()) {
      data[storeName] = await this.getAll(storeName);
    }
    
    return data;
  }

  /**
   * Import data from JSON
   */
  async import(data: Record<string, any[]>): Promise<void> {
    await this.init();
    
    for (const [storeName, items] of Object.entries(data)) {
      if (items.length > 0) {
        await this.clear(storeName);
        await this.bulkAdd(storeName, items);
      }
    }
  }

  /**
   * Close database
   */
  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
      this.initPromise = null;
    }
  }
}

// ================ FACTORY FUNCTIONS ================

/**
 * Create IndexedDB adapter
 */
export const createIndexedDB = (
  name: string,
  version: number,
  stores: Record<string, string | IndexedDBStoreConfig>
): IndexedDBAdapter => {
  return new IndexedDBAdapter({ name, version, stores });
};

/**
 * Create users database (example)
 */
export const createUsersDB = (): IndexedDBAdapter => {
  return new IndexedDBAdapter({
    name: 'users-db',
    version: 1,
    stores: {
      users: '++id, name, email, &username',
      sessions: '++id, userId, token, expiresAt',
      profiles: 'userId, name, avatar'
    }
  });
};

export default IndexedDBAdapter;