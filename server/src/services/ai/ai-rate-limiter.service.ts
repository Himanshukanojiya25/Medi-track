import { AIUsageCounterModel } from '../../models/ai/usage-counter/ai-usage-counter.model';
import { getWindowRange } from '../../utils/ai/ai-time-window.util';
import { DEFAULT_AI_LIMITS } from '../../constants/ai/ai-rate-limit.constants';
import { AIRateLimitResult } from '../../types/ai/ai-rate-limit.types';

export class AIRateLimiterService {
  static async checkAndConsume(
    scope: 'user' | 'role' | 'hospital',
    scopeId: string,
    window: 'daily' | 'monthly',
  ): Promise<AIRateLimitResult> {
    const limits =
      scope === 'user'
        ? DEFAULT_AI_LIMITS.USER
        : scope === 'role'
        ? DEFAULT_AI_LIMITS.ROLE
        : DEFAULT_AI_LIMITS.HOSPITAL;

    const limit = limits[window];
    const { end } = getWindowRange(window);

    const counter = await AIUsageCounterModel.findOneAndUpdate(
      { scope, scopeId, window, resetAt: end },
      { $inc: { count: 1 } },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      },
    );

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
      remaining: limit - counter.count,
      limit,
      resetAt: counter.resetAt,
    };
  }
}
