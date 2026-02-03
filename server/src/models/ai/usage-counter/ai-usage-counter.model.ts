import mongoose, { Schema, Document, Model } from "mongoose";

/**
 * AI Usage Counter Document
 * ------------------------
 * This model is used for:
 * - Rate limiting
 * - Usage tracking
 * - Future billing / analytics
 *
 * Design goals:
 * - Atomic increments
 * - High cardinality safe
 * - Window-based reset
 */
export interface IAIUsageCounter extends Document {
  scope: "user" | "role" | "hospital";
  scopeId: string;

  window: "daily" | "monthly";

  /**
   * Total consumed units in current window
   */
  count: number;

  /**
   * Window reset timestamp
   */
  resetAt: Date;

  /**
   * Metadata (future-proof)
   * Helps distinguish how counter was used
   * (rate-limit / usage / system)
   */
  source: "rate_limit" | "usage" | "system";

  createdAt: Date;
  updatedAt: Date;
}

const AIUsageCounterSchema = new Schema<IAIUsageCounter>(
  {
    scope: {
      type: String,
      required: true,
      enum: ["user", "role", "hospital"],
      index: true,
    },

    scopeId: {
      type: String,
      required: true,
      index: true,
    },

    window: {
      type: String,
      required: true,
      enum: ["daily", "monthly"],
    },

    count: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    resetAt: {
      type: Date,
      required: true,
      index: true,
    },

    /**
     * Optional categorization
     * (kept lightweight, default-safe)
     */
    source: {
      type: String,
      enum: ["rate_limit", "usage", "system"],
      default: "usage",
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/**
 * =========================
 * UNIQUE CONSTRAINT
 * =========================
 * Ensures exactly ONE counter per:
 * scope + scopeId + window + resetAt
 *
 * This is CRITICAL for concurrency safety
 */
AIUsageCounterSchema.index(
  { scope: 1, scopeId: 1, window: 1, resetAt: 1 },
  { unique: true }
);

/**
 * =========================
 * MODEL EXPORT (HOT-RELOAD SAFE)
 * =========================
 */
export const AIUsageCounterModel: Model<IAIUsageCounter> =
  mongoose.models.AIUsageCounter ||
  mongoose.model<IAIUsageCounter>(
    "AIUsageCounter",
    AIUsageCounterSchema
  );
