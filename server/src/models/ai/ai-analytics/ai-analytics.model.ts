import { model, models } from "mongoose";
import { AIAnalyticsSchema } from "./ai-analytics.schema";
import { AIAnalytics } from "./ai-analytics.types";

/**
 * ============================================
 * AI ANALYTICS — MODEL
 * ============================================
 */

export const AIAnalyticsModel =
  models.AIAnalytics ||
  model<AIAnalytics>(
    "AIAnalytics",
    AIAnalyticsSchema
  );
