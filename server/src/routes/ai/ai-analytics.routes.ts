import { Router } from "express";
import { AIAnalyticsController } from "../../controllers/ai/ai-analytics.controller";
import { aiAccessMiddleware } from "../../middlewares/ai/ai-access.middleware";

/**
 * =====================================================
 * AI ANALYTICS ROUTES
 * =====================================================
 * Phase: 3.4 (AI Analytics & Dashboard)
 *
 * Access control:
 * - super_admin
 * - hospital_admin
 *
 * Read-only routes
 */
const router = Router();

/**
 * GET /api/v1/ai/analytics/dashboard
 *
 * Query params (optional):
 * - from: ISO date
 * - to: ISO date
 * - granularity: hour | day | week | month
 */
router.get(
  "/dashboard",
  aiAccessMiddleware([
    "super_admin",
    "hospital_admin",
  ]),
  AIAnalyticsController.getDashboard
);

export default router;
