import { Router } from "express";
import { AIEnhancementController } from "../../controllers/ai/ai-enhancement.controller";
import { aiAccessMiddleware } from "../../middlewares/ai/ai-access.middleware";
import { aiRateLimitMiddleware } from "../../middlewares/ai/ai-rate-limit.middleware";
import { aiSafetyMiddleware } from "../../middlewares/ai/ai-safety.middleware";

const router = Router();

/**
 * =====================================================
 * AI ENHANCEMENT ROUTES
 * =====================================================
 * Phase: 3.3 (AI Enhancement)
 *
 * BASE PATH:
 * /api/v1/ai/suggestions/enhanced
 *
 * GUARANTEES
 * ----------
 * - Read-only
 * - Governance enforced
 * - Rate limited
 * - Safety checked
 * - Fail-safe
 */
router.get(
  "/enhanced",
  aiAccessMiddleware([
    "patient",
    "doctor",
    "hospital_admin",
    "system",
  ]),
  aiRateLimitMiddleware,
  aiSafetyMiddleware,
  AIEnhancementController.listEnhanced
);

export default router;
