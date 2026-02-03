import { AIUsageCounterModel } from "../../models/ai/usage-counter/ai-usage-counter.model";
import { getWindowRange } from "../../utils/ai/ai-time-window.util";

/**
 * AI Usage Service (Enterprise Grade)
 * ----------------------------------
 * Responsibilities:
 * - Track AI usage for analytics / billing / alerts
 * - Maintain accurate counters
 * - Never block requests
 *
 * IMPORTANT:
 * - This service DOES NOT enforce limits
 * - This service MUST be cheap & safe
 */
export class AIUsageService {
  /**
   * Increment usage counter
   * Fire-and-forget friendly
   */
  static async recordUsage(params: {
    scope: "user" | "role" | "hospital";
    scopeId: string;
    window: "daily" | "monthly";
    units?: number;
  }): Promise<void> {
    const { scope, scopeId, window, units = 1 } = params;

    /**
     * Calculate window reset
     */
    const { end } = getWindowRange(window);

    /**
     * Atomic increment
     * - Safe under concurrency
     * - Single DB roundtrip
     */
    await AIUsageCounterModel.updateOne(
      {
        scope,
        scopeId,
        window,
        resetAt: end,
      },
      {
        $inc: { count: units },
        $setOnInsert: {
          scope,
          scopeId,
          window,
          resetAt: end,
        },
      },
      {
        upsert: true,
      }
    ).catch(() => {
      /**
       * IMPORTANT:
       * Usage tracking must NEVER crash request flow
       * Errors are intentionally swallowed
       *
       * Observability / alerts can hook here later
       */
    });
  }
}
