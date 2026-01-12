// src/models/ai/ai-audit-log/ai-audit-log.schema.ts

import { Schema } from "mongoose";

export const AIAuditLogSchema = new Schema(
  {
    hospitalId: {
      type: Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
      index: true,
    },

    actorId: {
      type: Schema.Types.ObjectId,
      index: true,
    },

    actorRole: {
      type: String,
      required: true,
      enum: [
        "super_admin",
        "hospital_admin",
        "doctor",
        "patient",
        "system",
      ],
      index: true,
    },

    sessionId: {
      type: Schema.Types.ObjectId,
      ref: "ChatSession",
      index: true,
    },

    messageId: {
      type: Schema.Types.ObjectId,
      ref: "ChatMessage",
      index: true,
    },

    promptVersionId: {
      type: Schema.Types.ObjectId,
      ref: "PromptVersion",
      index: true,
    },

    action: {
      type: String,
      required: true,
      index: true,
    },

    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },

    ipAddress: {
      type: String,
    },

    userAgent: {
      type: String,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  }
);

/**
 * =========================
 * PHASE 3.1 — DB INDEXING
 * =========================
 */

/**
 * Hospital-level audit trail (admin / compliance)
 */
AIAuditLogSchema.index({
  hospitalId: 1,
  createdAt: -1,
});

/**
 * Session-wise AI trace (debug / replay)
 */
AIAuditLogSchema.index({
  sessionId: 1,
  createdAt: -1,
});

/**
 * Role-based activity analysis
 */
AIAuditLogSchema.index({
  actorRole: 1,
  createdAt: -1,
});

/**
 * Action-based filtering (security / monitoring)
 */
AIAuditLogSchema.index({
  action: 1,
  createdAt: -1,
});

/**
 * Actor activity timeline
 */
AIAuditLogSchema.index({
  actorId: 1,
  createdAt: -1,
});

/**
 * IMMUTABILITY GUARDS
 */
AIAuditLogSchema.pre("updateOne", () => {
  throw new Error("AI Audit Logs are immutable");
});
AIAuditLogSchema.pre("deleteOne", () => {
  throw new Error("AI Audit Logs cannot be deleted");
});
AIAuditLogSchema.pre("findOneAndUpdate", () => {
  throw new Error("AI Audit Logs are immutable");
});
AIAuditLogSchema.pre("findOneAndDelete", () => {
  throw new Error("AI Audit Logs cannot be deleted");
});
