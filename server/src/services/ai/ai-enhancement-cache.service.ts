/**
 * =====================================================
 * AI ENHANCEMENT CACHE SERVICE
 * =====================================================
 * Phase: 3.3 (AI Enhancement)
 *
 * RESPONSIBILITIES
 * ----------------
 * - Cache enhancement results
 * - Reduce compute & latency
 * - Provide deterministic reads
 *
 * DESIGN PRINCIPLES
 * -----------------
 * - In-memory by default (safe MVP)
 * - O(1) access
 * - TTL-based eviction
 * - Easy to replace with Redis later
 *
 * NON-GOALS
 * ---------
 * - No persistence guarantees
 * - No cross-instance sync
 */

import {
  AI_ENHANCEMENT_CACHE,
} from "../../constants/ai/ai-enhancement.constants";
import {
  AIEnhancementResult,
} from "../../types/ai/ai-enhancement.types";

/**
 * Internal cache record
 */
interface CacheEntry {
  value: AIEnhancementResult;
  expiresAt: number;
}

export class AIEnhancementCacheService {
  /**
   * In-memory cache store
   * key → CacheEntry
   */
  private static cache = new Map<string, CacheEntry>();

  /**
   * Get cached enhancement
   */
  static async get(
    key: string
  ): Promise<AIEnhancementResult | null> {
    if (!AI_ENHANCEMENT_CACHE.ENABLED) {
      return null;
    }

    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    /**
     * TTL expired → evict
     */
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.value;
  }

  /**
   * Set cache entry
   */
  static async set(
    key: string,
    value: AIEnhancementResult
  ): Promise<void> {
    if (!AI_ENHANCEMENT_CACHE.ENABLED) {
      return;
    }

    const ttlMs =
      AI_ENHANCEMENT_CACHE.TTL_SECONDS * 1000;

    this.cache.set(key, {
      value,
      expiresAt: Date.now() + ttlMs,
    });
  }

  /**
   * Optional: manual invalidation
   * (future analytics / admin use)
   */
  static async invalidate(
    key: string
  ): Promise<void> {
    this.cache.delete(key);
  }

  /**
   * Optional: clear entire cache
   * (admin / tests)
   */
  static async clear(): Promise<void> {
    this.cache.clear();
  }
}
