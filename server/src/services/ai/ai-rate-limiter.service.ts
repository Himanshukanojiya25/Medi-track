import { AIUsageCounterModel } from "../../models/ai/usage-counter/ai-usage-counter.model";
import { getWindowRange } from "../../utils/ai/ai-time-window.util";
import { DEFAULT_AI_LIMITS } from "../../constants/ai/ai-rate-limit.constants";
import { AIRateLimitResult } from "../../types/ai/ai-rate-limit.types";

/**
 * AI Rate Limiter Service (Enterprise Grade)
 * -----------------------------------------
 * Design goals:
 * - Atomic & concurrency-safe
 * - Predictable under high load
 * - No race conditions
 * - Storage-agnostic (Mongo today, Redis tomorrow)
 *
 * IMPORTANT:
 * - All enforcement logic lives here
 * - Middleware only orchestrates
 */
export class AIRateLimiterService {
  static async checkAndConsume(
    scope: "user" | "role" | "hospital",
    scopeId: string,
    window: "daily" | "monthly"
  ): Promise<AIRateLimitResult> {
    /**
     * Resolve limits deterministically
     */
    const limits =
      scope === "user"
        ? DEFAULT_AI_LIMITS.USER
        : scope === "role"
        ? DEFAULT_AI_LIMITS.ROLE
        : DEFAULT_AI_LIMITS.HOSPITAL;

    const limit = limits[window];

    /**
     * Calculate window boundaries
     * resetAt MUST be identical for all calls in same window
     */
    const { end } = getWindowRange(window);

    /**
     * Atomic increment
     * - find + inc + upsert in single DB roundtrip
     * - safe for concurrent requests (Mongo atomicity)
     */
    const counter = await AIUsageCounterModel.findOneAndUpdate(
      {
        scope,
        scopeId,
        window,
        resetAt: end,
      },
      {
        $inc: { count: 1 },
        $setOnInsert: {
          scope,
          scopeId,
          window,
          resetAt: end,
        },
      },
      {
        new: true,
        upsert: true,
      }
    );

    /**
     * Defensive fallback (should never happen, but prod-safe)
     */
    if (!counter) {
      return {
        allowed: true,
        remaining: limit,
        limit,
        resetAt: end,
      };
    }

    /**
     * Enforce limit
     */
    if (counter.count > limit) {
      return {
        allowed: false,
        remaining: 0,
        limit,
        resetAt: counter.resetAt,
      };
    }

    return {
      allowed: true,
      remaining: Math.max(limit - counter.count, 0),
      limit,
      resetAt: counter.resetAt,
    };
  }
}
