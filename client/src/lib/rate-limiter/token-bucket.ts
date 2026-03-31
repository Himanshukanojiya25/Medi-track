// src/lib/rate-limiter/token-bucket.ts

/**
 * 🪣 Token Bucket Rate Limiter
 * ✅ Burst traffic handling
 * ✅ Smooth request distribution
 * ✅ Perfect for API clients
 * ✅ Memory efficient
 * 
 * @example
 * ```typescript
 * const limiter = new TokenBucket({
 *   capacity: 100,      // Max tokens
 *   refillRate: 10,     // Tokens per second
 *   refillInterval: 1000 // Refill every second
 * });
 * 
 * if (limiter.take('user:123')) {
 *   // Process request
 * }
 * ```
 */

// ================ TYPES ================

export interface TokenBucketConfig {
  capacity: number;           // Maximum tokens bucket can hold
  refillRate: number;         // Tokens added per interval
  refillInterval: number;     // Refill interval in milliseconds
  maxKeys?: number;           // Max unique buckets
  storage?: TokenBucketStorage;
}

export interface TokenBucketStorage {
  get(key: string): TokenBucketState | null;
  set(key: string, state: TokenBucketState): void;
  delete(key: string): void;
  clear(): void;
  size(): number;
}

export interface TokenBucketState {
  tokens: number;             // Current tokens
  lastRefill: number;         // Last refill timestamp
}

export interface TokenBucketInfo {
  capacity: number;
  tokens: number;
  refillRate: number;
  nextRefill: number;
  waitTime?: number;          // Time until next token (if empty)
}

// ================ IN-MEMORY STORAGE ================

class MemoryTokenStorage implements TokenBucketStorage {
  private buckets: Map<string, TokenBucketState> = new Map();
  private maxSize: number;

  constructor(maxSize: number = 10000) {
    this.maxSize = maxSize;
  }

  get(key: string): TokenBucketState | null {
    return this.buckets.get(key) || null;
  }

  set(key: string, state: TokenBucketState): void {
    if (this.buckets.size >= this.maxSize && !this.buckets.has(key)) {
      const firstKey = this.buckets.keys().next().value;
      if (firstKey) this.buckets.delete(firstKey);
    }
    this.buckets.set(key, state);
  }

  delete(key: string): void {
    this.buckets.delete(key);
  }

  clear(): void {
    this.buckets.clear();
  }

  size(): number {
    return this.buckets.size;
  }

  keys(): string[] {
    return Array.from(this.buckets.keys());
  }
}

// ================ MAIN TOKEN BUCKET ================

export class TokenBucket {
  private config: TokenBucketConfig;
  private storage: TokenBucketStorage;
  private cleanupTimer: ReturnType<typeof setInterval> | null = null;

  constructor(config: TokenBucketConfig) {
    this.config = {
      maxKeys: 10000,
      ...config
    };
    
    this.storage = this.config.storage || new MemoryTokenStorage(this.config.maxKeys);
    this.startCleanup();
  }

  /**
   * Take a token if available
   */
  take(key: string, tokens: number = 1): boolean {
    const now = Date.now();
    const state = this.getOrCreateState(key, now);
    
    if (state.tokens >= tokens) {
      state.tokens -= tokens;
      this.storage.set(key, state);
      return true;
    }
    
    return false;
  }

  /**
   * Take token with wait time info
   */
  takeOrWait(key: string, tokens: number = 1): {
    success: boolean;
    tokens: number;
    waitMs?: number;
    nextRefill: number;
  } {
    const now = Date.now();
    const state = this.getOrCreateState(key, now);
    
    if (state.tokens >= tokens) {
      state.tokens -= tokens;
      this.storage.set(key, state);
      
      return {
        success: true,
        tokens: state.tokens,
        nextRefill: now + this.config.refillInterval
      };
    }
    
    // Calculate wait time
    const tokensNeeded = tokens - state.tokens;
    const waitMs = Math.ceil(tokensNeeded / this.config.refillRate) * this.config.refillInterval;
    
    return {
      success: false,
      tokens: state.tokens,
      waitMs,
      nextRefill: state.lastRefill + this.config.refillInterval
    };
  }

  /**
   * Get current bucket info
   */
  getInfo(key: string): TokenBucketInfo {
    const now = Date.now();
    const state = this.getOrCreateState(key, now);
    
    const nextRefill = state.lastRefill + this.config.refillInterval;
    const waitTime = state.tokens === 0 
      ? nextRefill - now 
      : undefined;
    
    return {
      capacity: this.config.capacity,
      tokens: state.tokens,
      refillRate: this.config.refillRate,
      nextRefill,
      waitTime: waitTime && waitTime > 0 ? waitTime : undefined
    };
  }

  /**
   * Add tokens manually
   */
  addTokens(key: string, tokens: number): number {
    const now = Date.now();
    const state = this.getOrCreateState(key, now);
    
    state.tokens = Math.min(
      this.config.capacity,
      state.tokens + tokens
    );
    
    this.storage.set(key, state);
    return state.tokens;
  }

  /**
   * Reset bucket for a key
   */
  reset(key: string): void {
    this.storage.delete(key);
  }

  /**
   * Reset all buckets
   */
  resetAll(): void {
    this.storage.clear();
  }

  /**
   * Get active bucket count
   */
  getActiveCount(): number {
    return this.storage.size();
  }

  /**
   * Update config
   */
  updateConfig(config: Partial<TokenBucketConfig>): void {
    this.config = { ...this.config, ...config };
  }

  private getOrCreateState(key: string, now: number): TokenBucketState {
    let state = this.storage.get(key);
    
    if (!state) {
      state = {
        tokens: this.config.capacity,
        lastRefill: now
      };
    } else {
      // Refill tokens based on time passed
      const timePassed = now - state.lastRefill;
      const refillIntervals = Math.floor(timePassed / this.config.refillInterval);
      
      if (refillIntervals > 0) {
        const tokensToAdd = refillIntervals * this.config.refillRate;
        state.tokens = Math.min(
          this.config.capacity,
          state.tokens + tokensToAdd
        );
        state.lastRefill += refillIntervals * this.config.refillInterval;
      }
    }
    
    return state;
  }

  private startCleanup(): void {
    const CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes
    
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, CLEANUP_INTERVAL);
  }

  private cleanup(): void {
    if (!(this.storage instanceof MemoryTokenStorage)) return;
    
    const now = Date.now();
    const maxAge = 30 * 60 * 1000; // 30 minutes
    
    const keys = (this.storage as MemoryTokenStorage).keys();
    
    for (const key of keys) {
      const state = this.storage.get(key);
      if (!state) continue;
      
      // Delete if bucket is full and inactive
      if (state.tokens === this.config.capacity && now - state.lastRefill > maxAge) {
        this.storage.delete(key);
      }
    }
  }

  /**
   * Shutdown limiter
   */
  shutdown(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
  }
}

// ================ FACTORY FUNCTIONS ================

/**
 * Create a token bucket for API rate limiting
 * @example
 * const apiBucket = createApiTokenBucket(100, 10); // 100 tokens, refill 10/sec
 */
export const createApiTokenBucket = (capacity: number = 100, tokensPerSecond: number = 10): TokenBucket => {
  return new TokenBucket({
    capacity,
    refillRate: tokensPerSecond,
    refillInterval: 1000 // 1 second
  });
};

/**
 * Create a token bucket for burst traffic
 * @example
 * const burstBucket = createBurstTokenBucket(1000, 100); // 1000 burst, refill 100/sec
 */
export const createBurstTokenBucket = (burstCapacity: number = 1000, sustainedRate: number = 100): TokenBucket => {
  return new TokenBucket({
    capacity: burstCapacity,
    refillRate: sustainedRate,
    refillInterval: 1000
  });
};

export default TokenBucket;