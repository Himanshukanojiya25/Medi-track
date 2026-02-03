import { Request, Response, NextFunction } from "express";
import { AIRateLimiterService } from "../../services/ai/ai-rate-limiter.service";
import { AI_RATE_LIMIT_ERRORS } from "../../constants/ai/ai-rate-limit.constants";

/**
 * AI Rate Limit Middleware (Enterprise Grade)
 */
export const aiRateLimitMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    /**
     * Defensive auth extraction
     */
    const user = (req as any).user as
      | { id?: string; role?: string; hospitalId?: string }
      | undefined;

    if (!user?.id || !user.role || !user.hospitalId) {
      res.status(401).json({
        success: false,
        error: {
          code: "AI_RATE_LIMIT_AUTH_MISSING",
          message: "Authentication context missing for AI rate limiting",
        },
      });
      return;
    }

    /**
     * Parallel rate limit checks
     */
    const checks = await Promise.all([
      AIRateLimiterService.checkAndConsume("user", user.id, "daily"),
      AIRateLimiterService.checkAndConsume("role", user.role, "daily"),
      AIRateLimiterService.checkAndConsume(
        "hospital",
        user.hospitalId,
        "daily"
      ),
    ]);

    const blocked = checks.find((c) => !c.allowed);

    if (blocked) {
      res.status(429).json({
        success: false,
        error: AI_RATE_LIMIT_ERRORS.RATE_LIMIT_EXCEEDED,
        meta: {
          resetAt: blocked.resetAt,
        },
      });
      return;
    }

    next();
  } catch (err) {
    /**
     * Fail-safe: limiter infra failure
     */
    res.status(503).json({
      success: false,
      error: {
        code: "AI_RATE_LIMIT_SERVICE_UNAVAILABLE",
        message: "AI rate limiting service unavailable",
      },
    });
  }
};
