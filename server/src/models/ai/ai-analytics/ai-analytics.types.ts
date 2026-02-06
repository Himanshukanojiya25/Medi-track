/**
 * ============================================
 * AI ANALYTICS — TYPES
 * ============================================
 * Phase: 3.4 (AI Analytics)
 *
 * DESIGN GOALS
 * ------------
 * - Read-heavy analytics
 * - Aggregation-friendly
 * - No runtime logic
 * - Stable contracts
 */

/**
 * Time bucket granularity
 */
export type AIAnalyticsGranularity =
  | "hour"
  | "day"
  | "week"
  | "month";

/**
 * Analytics scope
 */
export type AIAnalyticsScope =
  | "system"
  | "hospital";

/**
 * Core analytics record
 * (1 document per bucket)
 */
export interface AIAnalytics {
  /**
   * Scope of analytics
   * system → super admin
   * hospital → hospital admin
   */
  scope: AIAnalyticsScope;

  /**
   * Hospital context (only for hospital scope)
   */
  hospitalId?: string;

  /**
   * Time bucket
   */
  bucketStart: Date;
  bucketEnd: Date;

  /**
   * Granularity level
   */
  granularity: AIAnalyticsGranularity;

  /**
   * ============================
   * USAGE METRICS
   * ============================
   */
  totalRequests: number;
  uniqueUsers: number;

  /**
   * ============================
   * SUGGESTION METRICS
   * ============================
   */
  suggestionsGenerated: number;
  suggestionsViewed: number;
  suggestionsActioned: number;

  /**
   * ============================
   * ENHANCEMENT METRICS
   * ============================
   */
  enhancementsRequested: number;
  enhancementsSucceeded: number;
  enhancementsFailed: number;

  /**
   * ============================
   * ERROR METRICS
   * ============================
   */
  rateLimitHits: number;
  safetyBlocked: number;

  /**
   * Creation timestamp
   */
  createdAt: Date;
}
