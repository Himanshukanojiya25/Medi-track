/**
 * =====================================================
 * AI ANALYTICS SERVICE
 * =====================================================
 * Phase: 3.4 (AI Analytics & Dashboard)
 *
 * RESPONSIBILITIES
 * ----------------
 * - Aggregate AI usage & intelligence metrics
 * - Provide read-only dashboard data
 * - Enforce scope (system / hospital)
 *
 * NON-GOALS
 * ---------
 * - No writes (append-only handled by jobs)
 * - No Express / HTTP concerns
 * - No AI logic
 */

import { Types } from "mongoose";
import {
  AIAnalyticsGranularity,
  AIAnalyticsScope,
} from "../../models/ai/ai-analytics";

// Existing AI models
import { AIAuditLogModel } from "../../models/ai/ai-audit-log";
import { AIUsageCounterModel } from "../../models/ai/usage-counter";
import { AISuggestionModel } from "../../models/ai/suggestion";

export interface AIAnalyticsQuery {
  scope: AIAnalyticsScope; // "system" | "hospital"
  hospitalId?: string;
  from: Date;
  to: Date;
  granularity: AIAnalyticsGranularity;
}

export interface AIAnalyticsDashboard {
  range: {
    from: Date;
    to: Date;
    granularity: AIAnalyticsGranularity;
  };

  usage: {
    totalRequests: number;
    uniqueUsers: number;
  };

  suggestions: {
    generated: number;
    viewed: number;
    actioned: number;
  };

  enhancements: {
    requested: number;
    succeeded: number;
    failed: number;
  };

  errors: {
    rateLimitHits: number;
    safetyBlocked: number;
  };
}

export class AIAnalyticsService {
  /**
   * ===================================================
   * PUBLIC DASHBOARD API
   * ===================================================
   */
  static async getDashboard(
    query: AIAnalyticsQuery
  ): Promise<AIAnalyticsDashboard> {
    this.validateQuery(query);

    const [
      usage,
      suggestions,
      enhancements,
      errors,
    ] = await Promise.all([
      this.aggregateUsage(query),
      this.aggregateSuggestions(query),
      this.aggregateEnhancements(query),
      this.aggregateErrors(query),
    ]);

    return {
      range: {
        from: query.from,
        to: query.to,
        granularity: query.granularity,
      },
      usage,
      suggestions,
      enhancements,
      errors,
    };
  }

  /**
   * ===================================================
   * USAGE METRICS (FIXED FOR NEW SCHEMA)
   * ===================================================
   */
  private static async aggregateUsage(
    query: AIAnalyticsQuery
  ) {
    const match: any = {
      createdAt: {
        $gte: query.from,
        $lte: query.to,
      },
    };

    if (query.scope === "hospital") {
      match.hospitalId = new Types.ObjectId(query.hospitalId);
    }

    const result = await AIUsageCounterModel.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          totalRequests: { $sum: "$totalRequests" },
          uniqueUsers: { $addToSet: "$userId" },
        },
      },
      {
        $project: {
          _id: 0,
          totalRequests: 1,
          uniqueUsers: { $size: "$uniqueUsers" },
        },
      },
    ]);

    return (
      result[0] || {
        totalRequests: 0,
        uniqueUsers: 0,
      }
    );
  }

  /**
   * ===================================================
   * SUGGESTION METRICS
   * ===================================================
   */
  private static async aggregateSuggestions(
    query: AIAnalyticsQuery
  ) {
    const match: any = {
      createdAt: {
        $gte: query.from,
        $lte: query.to,
      },
    };

    if (query.scope === "hospital") {
      match.hospitalId = new Types.ObjectId(query.hospitalId);
    }

    const result = await AISuggestionModel.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          generated: { $sum: 1 },
          viewed: {
            $sum: { $cond: ["$viewed", 1, 0] },
          },
          actioned: {
            $sum: { $cond: ["$actioned", 1, 0] },
          },
        },
      },
      {
        $project: {
          _id: 0,
          generated: 1,
          viewed: 1,
          actioned: 1,
        },
      },
    ]);

    return (
      result[0] || {
        generated: 0,
        viewed: 0,
        actioned: 0,
      }
    );
  }

  /**
   * ===================================================
   * ENHANCEMENT METRICS
   * ===================================================
   */
  private static async aggregateEnhancements(
    query: AIAnalyticsQuery
  ) {
    const match: any = {
      createdAt: {
        $gte: query.from,
        $lte: query.to,
      },
      category: "enhancement",
    };

    if (query.scope === "hospital") {
      match.hospitalId = new Types.ObjectId(query.hospitalId);
    }

    const result = await AIAuditLogModel.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          requested: { $sum: 1 },
          succeeded: {
            $sum: { $cond: ["$success", 1, 0] },
          },
          failed: {
            $sum: { $cond: ["$success", 0, 1] },
          },
        },
      },
      {
        $project: {
          _id: 0,
          requested: 1,
          succeeded: 1,
          failed: 1,
        },
      },
    ]);

    return (
      result[0] || {
        requested: 0,
        succeeded: 0,
        failed: 0,
      }
    );
  }

  /**
   * ===================================================
   * ERROR METRICS
   * ===================================================
   */
  private static async aggregateErrors(
    query: AIAnalyticsQuery
  ) {
    const match: any = {
      createdAt: {
        $gte: query.from,
        $lte: query.to,
      },
      success: false,
    };

    if (query.scope === "hospital") {
      match.hospitalId = new Types.ObjectId(query.hospitalId);
    }

    const result = await AIAuditLogModel.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$errorCode",
          count: { $sum: 1 },
        },
      },
    ]);

    let rateLimitHits = 0;
    let safetyBlocked = 0;

    for (const row of result) {
      if (row._id === "AI_RATE_LIMIT_EXCEEDED") {
        rateLimitHits += row.count;
      }
      if (row._id === "AI_SAFETY_BLOCKED") {
        safetyBlocked += row.count;
      }
    }

    return {
      rateLimitHits,
      safetyBlocked,
    };
  }

  /**
   * ===================================================
   * VALIDATION
   * ===================================================
   */
  private static validateQuery(
    query: AIAnalyticsQuery
  ) {
    if (!query.from || !query.to) {
      throw new Error("Invalid date range");
    }

    if (query.scope === "hospital" && !query.hospitalId) {
      throw new Error("hospitalId required for hospital scope");
    }
  }
}
