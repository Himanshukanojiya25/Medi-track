import { Schema } from "mongoose";

/**
 * ============================
 * AI SUGGESTION SCHEMA
 * ============================
 * Immutable, append-only
 */

export const AISuggestionSchema = new Schema(
  {
    hospitalId: {
      type: Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
      index: true,
    },

    code: {
      type: String,
      required: true,
      index: true,
    },

    targetRole: {
      type: String,
      required: true,
      index: true,
    },

    category: {
      type: String,
      required: true,
      index: true,
    },

    priority: {
      type: String,
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    source: {
      type: String,
      required: true,
      index: true,
    },

    actorId: {
      type: Schema.Types.ObjectId,
      index: true,
    },

    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  }
);

/**
 * ============================
 * INDEXING (PHASE-3 READY)
 * ============================
 */

// One suggestion per code per hospital per day
AISuggestionSchema.index(
  { hospitalId: 1, code: 1, createdAt: -1 }
);

/**
 * ============================
 * IMMUTABILITY GUARDS
 * ============================
 */
AISuggestionSchema.pre("updateOne", () => {
  throw new Error("AI Suggestions are immutable");
});
AISuggestionSchema.pre("findOneAndUpdate", () => {
  throw new Error("AI Suggestions are immutable");
});
AISuggestionSchema.pre("deleteOne", () => {
  throw new Error("AI Suggestions cannot be deleted");
});
