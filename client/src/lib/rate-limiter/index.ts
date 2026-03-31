// src/lib/rate-limiter/index.ts

/**
 * 🚦 Production-Grade Rate Limiting Module
 * 
 * Multiple algorithms for different use cases:
 * - **Token Bucket**: Burst traffic handling, smooth distribution
 * - **Sliding Window**: Precise API rate limiting
 * - **Hybrid**: Combined approach for maximum flexibility
 * 
 * @module rate-limiter
 * 
 * @example
 * ```typescript
 * // Simple API rate limiting
 * import { rateLimiter } from './rate-limiter';
 * 
 * app.use((req, res, next) => {
 *   if (rateLimiter.check(req.ip)) {
 *     next();
 *   } else {
 *     res.status(429).send('Too Many Requests');
 *   }
 * });
 * 
 * // Advanced with token bucket
 * import { tokenBucket, slidingWindow } from './rate-limiter';
 * 
 * const apiLimiter = tokenBucket(100, 10); // 100 burst, 10/sec sustained
 * const loginLimiter = slidingWindow(5, 900000); // 5 per 15 minutes
 * ```
 */

// ============================================================================
// CORE RATE LIMITER (Singleton)
// ============================================================================

export {
  rateLimiter,
  RateLimiter,
  type RateLimiterConfig,
  type RateLimiterStorage,
  type RateLimitBucket,
  type RateLimitResult,
  type RateLimitInfo
} from './rate-limiter.service';

// ============================================================================
// SLIDING WINDOW LIMITER
// ============================================================================

export {
  SlidingWindowLimiter,
  createApiLimiter,
  createLoginLimiter,
  type SlidingWindowConfig,
  type SlidingWindowStorage,
  type WindowInfo
} from './sliding-window';

// ============================================================================
// TOKEN BUCKET LIMITER
// ============================================================================

export {
  TokenBucket,
  createApiTokenBucket,
  createBurstTokenBucket,
  type TokenBucketConfig,
  type TokenBucketStorage,
  type TokenBucketState,
  type TokenBucketInfo
} from './token-bucket';

// ============================================================================
// HYBRID LIMITER (Combines both approaches)
// ============================================================================

import { SlidingWindowLimiter, createApiLimiter, createLoginLimiter, type WindowInfo } from './sliding-window';
import { TokenBucket, createApiTokenBucket, createBurstTokenBucket, type TokenBucketInfo } from './token-bucket';
import { rateLimiter as coreLimiter, createRateLimiter } from './rate-limiter.service';

/**
 * 🎯 Hybrid Rate Limiter
 * Combines sliding window for precise limits + token bucket for bursts
 * 
 * @example
 * ```typescript
 * const limiter = createHybridLimiter({
 *   windowLimit: 100,      // 100 requests per minute
 *   burstCapacity: 20,      // Allow bursts of 20
 *   refillRate: 5          // Refill 5 tokens per second
 * });
 * 
 * const result = limiter.check('user:123');
 * ```
 */
export class HybridLimiter {
  private windowLimiter: SlidingWindowLimiter;
  private burstLimiter: TokenBucket;
  
  constructor(config: {
    windowLimit: number;
    windowMs?: number;
    burstCapacity: number;
    refillRate: number;
    refillInterval?: number;
  }) {
    this.windowLimiter = new SlidingWindowLimiter({
      limit: config.windowLimit,
      windowMs: config.windowMs || 60000
    });
    
    this.burstLimiter = new TokenBucket({
      capacity: config.burstCapacity,
      refillRate: config.refillRate,
      refillInterval: config.refillInterval || 1000
    });
  }
  
  /**
   * Check if request is allowed under both limits
   */
  check(key: string): boolean {
    // First check burst limit (fast)
    if (!this.burstLimiter.take(key)) {
      return false;
    }
    
    // Then check window limit (precise)
    return this.windowLimiter.check(key);
  }
  
  /**
   * Consume with detailed result
   */
  consume(key: string): {
    allowed: boolean;
    reason?: 'window' | 'burst';
    windowInfo?: WindowInfo;
    burstInfo?: TokenBucketInfo;
    retryAfter?: number;
  } {
    const burstResult = this.burstLimiter.takeOrWait(key);
    
    if (!burstResult.success) {
      return {
        allowed: false,
        reason: 'burst',
        burstInfo: this.burstLimiter.getInfo(key),
        retryAfter: burstResult.waitMs
      };
    }
    
    const windowResult = this.windowLimiter.increment(key);
    
    if (!windowResult.allowed) {
      // Rollback burst token
      this.burstLimiter.addTokens(key, 1);
      
      return {
        allowed: false,
        reason: 'window',
        windowInfo: this.windowLimiter.getInfo(key),
        retryAfter: windowResult.retryAfter
      };
    }
    
    return {
      allowed: true,
      windowInfo: this.windowLimiter.getInfo(key),
      burstInfo: this.burstLimiter.getInfo(key)
    };
  }
  
  /**
   * Reset for a key
   */
  reset(key: string): void {
    this.windowLimiter.reset(key);
    this.burstLimiter.reset(key);
  }
  
  /**
   * Get both limiters info
   */
  getInfo(key: string): {
    window: WindowInfo;
    burst: TokenBucketInfo;
  } {
    return {
      window: this.windowLimiter.getInfo(key),
      burst: this.burstLimiter.getInfo(key)
    };
  }
  
  /**
   * Shutdown
   */
  shutdown(): void {
    this.windowLimiter.shutdown();
    this.burstLimiter.shutdown();
  }
}

/**
 * Create a hybrid rate limiter
 */
export const createHybridLimiter = (config: ConstructorParameters<typeof HybridLimiter>[0]): HybridLimiter => {
  return new HybridLimiter(config);
};

// ============================================================================
// DECORATORS (For class methods)
// ============================================================================

/**
 * Decorator for rate limiting class methods
 * @example
 * ```typescript
 * class ApiService {
 *   @RateLimit('user:{{userId}}', 100, 60000)
 *   async getUserData(userId: string) {
 *     // This method is rate limited
 *   }
 * }
 * ```
 */
export function RateLimit(keyPattern: string, limit?: number, window?: number) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function(...args: any[]) {
      // Replace placeholders in key pattern
      let key = keyPattern;
      const matches = keyPattern.match(/\{\{([^}]+)\}\}/g);
      
      if (matches) {
        matches.forEach((match: string) => {
          const paramName = match.replace(/\{\{|\}\}/g, '');
          // Find parameter value
          const paramIndex = target.constructor
            .toString()
            .match(/\(([^)]*)\)/)?.[1]
            .split(',')
            .map((p: string) => p.trim())
            .indexOf(paramName);
            
          if (paramIndex !== undefined && paramIndex >= 0) {
            key = key.replace(match, args[paramIndex]);
          }
        });
      }
      
      if (!coreLimiter.check(key, limit, window)) {
        throw new Error('Rate limit exceeded');
      }
      
      return originalMethod.apply(this, args);
    };
    
    return descriptor;
  };
}

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Create Express.js middleware
 * @example
 * ```typescript
 * import { createExpressMiddleware } from './rate-limiter';
 * 
 * app.use('/api', createExpressMiddleware({
 *   keyGenerator: (req) => req.ip,
 *   limit: 100,
 *   window: 60000
 * }));
 * ```
 */
export const createExpressMiddleware = (options: {
  keyGenerator: (req: any) => string;
  limit?: number;
  window?: number;
  limiter?: 'core' | 'sliding' | 'token' | 'hybrid';
}) => {
  return (req: any, res: any, next: any) => {
    const key = options.keyGenerator(req);
    
    let allowed: boolean;
    
    switch (options.limiter) {
      case 'sliding':
        const sliding = new SlidingWindowLimiter({
          limit: options.limit || 100,
          windowMs: options.window || 60000
        });
        allowed = sliding.check(key);
        break;
        
      case 'token':
        const token = new TokenBucket({
          capacity: options.limit || 100,
          refillRate: 10,
          refillInterval: 1000
        });
        allowed = token.take(key);
        break;
        
      case 'hybrid':
        const hybrid = createHybridLimiter({
          windowLimit: options.limit || 100,
          windowMs: options.window,
          burstCapacity: 20,
          refillRate: 10
        });
        const result = hybrid.consume(key);
        allowed = result.allowed;
        break;
        
      default:
        allowed = coreLimiter.check(key, options.limit, options.window);
    }
    
    if (allowed) {
      next();
    } else {
      res.status(429).json({
        error: 'Too Many Requests',
        message: 'Rate limit exceeded'
      });
    }
  };
};

// ============================================================================
// MEMORY USAGE MONITOR
// ============================================================================

/**
 * Monitor rate limiter memory usage
 */
export const getMemoryUsage = (): {
  core: number;
  sliding: number;
  token: number;
  total: number;
} => {
  const core = coreLimiter.getBucketCount();
  
  // Approximate memory usage (4KB per bucket)
  const coreMemory = core * 4096;
  const total = coreMemory;
  
  return {
    core,
    sliding: 0,
    token: 0,
    total
  };
};

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default {
  // Core rate limiter
  check: coreLimiter.check,
  consume: coreLimiter.consume,
  getInfo: coreLimiter.getInfo,
  reset: coreLimiter.reset,
  resetAll: coreLimiter.resetAll,
  
  // Factory functions
  createRateLimiter,
  createApiLimiter,
  createLoginLimiter,
  createApiTokenBucket,
  createBurstTokenBucket,
  createHybridLimiter,
  
  // Classes
  SlidingWindowLimiter,
  TokenBucket,
  HybridLimiter,
  
  // Utilities
  createExpressMiddleware,
  getMemoryUsage,
  RateLimit // Decorator
};