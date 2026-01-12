import { Request, Response, NextFunction } from 'express';
import { AIRateLimiterService } from '../../services/ai/ai-rate-limiter.service';
import { AI_RATE_LIMIT_ERRORS } from '../../constants/ai/ai-rate-limit.constants';

export const aiRateLimitMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const user = req.user as {
    id: string;
    role: string;
    hospitalId: string;
  };

  const checks = await Promise.all([
    AIRateLimiterService.checkAndConsume('user', user.id, 'daily'),
    AIRateLimiterService.checkAndConsume('role', user.role, 'daily'),
    AIRateLimiterService.checkAndConsume(
      'hospital',
      user.hospitalId,
      'daily',
    ),
  ]);

  const blocked = checks.find((c) => !c.allowed);

  if (blocked) {
    res.status(429).json({
      success: false,
      error: AI_RATE_LIMIT_ERRORS.RATE_LIMIT_EXCEEDED,
      resetAt: blocked.resetAt,
    });
    return;
  }

  next();
};
