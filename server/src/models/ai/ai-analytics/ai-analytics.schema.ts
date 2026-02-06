import { Schema } from "mongoose";
import {
  AIAnalytics,
} from "./ai-analytics.types";

/**
 * ============================================
 * AI ANALYTICS — SCHEMA
 * ============================================
 *
 * IMPORTANT
 * ---------
 * - Optimized for aggregation queries
 * - Immutable records (append-only)
 * - Indexed by time & scope
 */

export const AIAnalyticsSchema =
  new Schema<AIAnalytics>(
    {
      scope: {
        type: String,
        enum: ["system", "hospital"],
        required: true,
        index: true,
      },

      hospitalId: {
        type: String,
        index: true,
      },

      bucketStart: {
        type: Date,
        required: true,
        index: true,
      },

      bucketEnd: {
        type: Date,
        required: true,
      },

      granularity: {
        type: String,
        enum: ["hour", "day", "week", "month"],
        required: true,
        index: true,
      },

      // Usage metrics
      totalRequests: {
        type: Number,
        default: 0,
      },
      uniqueUsers: {
        type: Number,
        default: 0,
      },

      // Suggestion metrics
      suggestionsGenerated: {
        type: Number,
        default: 0,
      },
      suggestionsViewed: {
        type: Number,
        default: 0,
      },
      suggestionsActioned: {
        type: Number,
        default: 0,
      },

      // Enhancement metrics
      enhancementsRequested: {
        type: Number,
        default: 0,
      },
      enhancementsSucceeded: {
        type: Number,
        default: 0,
      },
      enhancementsFailed: {
        type: Number,
        default: 0,
      },

      // Error metrics
      rateLimitHits: {
        type: Number,
        default: 0,
      },
      safetyBlocked: {
        type: Number,
        default: 0,
      },
    },
    {
      timestamps: {
        createdAt: true,
        updatedAt: false, // IMMUTABLE
      },
      versionKey: false,
    }
  );

/**
 * ============================
 * COMPOUND INDEXES
 * ============================
 * Designed for fast dashboards
 */

// System-level analytics
AIAnalyticsSchema.index({
  scope: 1,
  granularity: 1,
  bucketStart: -1,
});

// Hospital-level analytics
AIAnalyticsSchema.index({
  scope: 1,
  hospitalId: 1,
  granularity: 1,
  bucketStart: -1,
});
