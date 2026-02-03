// src/middlewares/ai/ai-access.middleware.ts

import { Request, Response, NextFunction } from "express";
import { AI_CONFIG } from "../../config/ai";
import { AI_ERRORS } from "../../constants/ai/ai-errors.constants";
import { AIGovernanceService } from "../../services/ai/ai-governance.service";

/**
 * AI Access Middleware
 * --------------------
 * Responsibilities:
 * - Global AI enable / disable check
 * - Role-based AI access control
 * - Fast short-circuit for disallowed requests
 *
 * IMPORTANT:
 * - No DB calls
 * - No rate limiting here
 * - No AI provider usage
 * - Pure governance layer
 *
 * This middleware MUST be cheap (O(1))
 * Safe for millions of concurrent users
 */
export const aiAccessMiddleware = (
  allowedRoles: string[] = []
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      /**
       * Fast global kill-switch
       */
      if (!AI_CONFIG.ENABLED) {
        return res.status(503).json({
          success: false,
          error: AI_ERRORS.AI_DISABLED,
        });
      }

      /**
       * Auth middleware must run before this
       * req.user is assumed to be present
       */
      const user = (req as any).user;

      if (!user || !user.role) {
        return res.status(401).json({
          success: false,
          error: AI_ERRORS.AI_ACCESS_DENIED,
        });
      }

      /**
       * Governance validation
       * Centralized, reusable logic
       */
      AIGovernanceService.validateAccess({
        enabled: AI_CONFIG.ENABLED,
        aiMode: AI_CONFIG.MODE,
        role: user.role,
        allowedRoles,
      });

      /**
       * Attach AI metadata to request
       * (read-only, no heavy object)
       */
      (req as any).ai = {
        mode: AI_CONFIG.MODE,
      };

      return next();
    } catch (err: any) {
      return res.status(403).json({
        success: false,
        error: err,
      });
    }
  };
};
