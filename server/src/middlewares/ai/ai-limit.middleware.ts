// src/middlewares/ai/ai-limit.middleware.ts

import { Request, Response, NextFunction } from "express";
import { AI_ERRORS } from "../../constants/ai/ai-errors.constants";
import { AI_CONFIG } from "../../config/ai";

/**
 * AI Usage Limit Middleware
 * ------------------------
 * Responsibilities:
 * - Enforce SYSTEM-LEVEL usage caps
 * - Protect infra from abuse
 * - Act as a hard safety boundary
 *
 * IMPORTANT:
 * - No DB access here
 * - No sliding window logic
 * - No role-based rate limiting
 *
 * This middleware is FAST and PREDICTABLE
 * Safe for very high traffic
 */
export const aiLimitMiddleware = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    /**
     * AI metadata must be attached by aiAccessMiddleware
     */
    const aiMeta = (req as any).ai;

    if (!aiMeta) {
      // Defensive: AI route hit without governance middleware
      return res.status(500).json({
        success: false,
        error: {
          code: "AI_GOVERNANCE_MISSING",
          message: "AI governance middleware not initialized",
        },
      });
    }

    /**
     * Hard system cap
     * (protects infra regardless of role)
     */
    const maxRequestsPerMinute =
      AI_CONFIG.LIMITS.MAX_REQUESTS_PER_MINUTE;

    /**
     * Usage counters are expected to be injected
     * by a previous lightweight tracker (optional)
     *
     * If not present, we FAIL SAFE (allow request)
     */
    const usage = (req as any).aiUsage;

    if (usage && usage.requestsInCurrentWindow > maxRequestsPerMinute) {
      return res.status(429).json({
        success: false,
        error: AI_ERRORS.AI_USAGE_LIMIT_EXCEEDED,
      });
    }

    return next();
  };
};
