import { Request, Response } from "express";
import { AIAnalyticsService } from "../../services/ai/ai-analytics.service";

/**
 * =====================================================
 * AI ANALYTICS CONTROLLER
 * =====================================================
 * Phase: 3.4 (AI Analytics & Dashboard)
 *
 * RESPONSIBILITIES
 * ----------------
 * - Expose read-only analytics APIs
 * - Enforce role-based access
 * - Normalize request params
 *
 * NON-GOALS
 * ---------
 * - No DB access
 * - No aggregation logic
 * - No AI logic
 */
export class AIAnalyticsController {
  /**
   * ===================================================
   * GET AI DASHBOARD (SYSTEM / HOSPITAL)
   * ===================================================
   * GET /api/v1/ai/analytics/dashboard
   *
   * Access:
   * - super_admin  → system scope
   * - hospital_admin → hospital scope
   */
  static async getDashboard(
    req: Request,
    res: Response
  ) {
    try {
      const user = (req as any).user;

      if (!user || !user.role) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      /**
       * -----------------------------------------------
       * Resolve scope from role
       * -----------------------------------------------
       */
      let scope: "system" | "hospital";
      let hospitalId: string | undefined;

      if (user.role === "super_admin") {
        scope = "system";
      } else if (user.role === "hospital_admin") {
        scope = "hospital";
        hospitalId = user.hospitalId;
      } else {
        return res.status(403).json({
          success: false,
          message:
            "Access denied for AI analytics",
        });
      }

      /**
       * -----------------------------------------------
       * Normalize query params
       * -----------------------------------------------
       */
      const from = req.query.from
        ? new Date(String(req.query.from))
        : new Date(
            Date.now() - 7 * 24 * 60 * 60 * 1000
          ); // default: last 7 days

      const to = req.query.to
        ? new Date(String(req.query.to))
        : new Date();

      const granularity = (req.query
        .granularity ||
        "day") as
        | "hour"
        | "day"
        | "week"
        | "month";

      /**
       * -----------------------------------------------
       * Delegate to service
       * -----------------------------------------------
       */
      const dashboard =
        await AIAnalyticsService.getDashboard({
          scope,
          hospitalId,
          from,
          to,
          granularity,
        });

      return res.status(200).json({
        success: true,
        data: dashboard,
      });
    } catch (err: any) {
      /**
       * HARD FAIL-SAFE
       * Analytics must NEVER crash API
       */
      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch AI analytics dashboard",
      });
    }
  }
}
