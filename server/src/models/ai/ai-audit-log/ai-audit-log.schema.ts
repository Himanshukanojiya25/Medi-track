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

    /**
     * Phase-1 governance fields
     */
    aiMode: {
      type: String,
      enum: ["mock", "real"],
      required: true,
      index: true,
    },

    actionType: {
      type: String,
      enum: ["CHAT", "USAGE", "LIMIT", "SYSTEM"],
      required: true,
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
 * INDEXES (SCALE SAFE)
 * =========================
 */
AIAuditLogSchema.index({ hospitalId: 1, createdAt: -1 });
AIAuditLogSchema.index({ sessionId: 1, createdAt: -1 });
AIAuditLogSchema.index({ actorRole: 1, createdAt: -1 });
AIAuditLogSchema.index({ actionType: 1, createdAt: -1 });
AIAuditLogSchema.index({ action: 1, createdAt: -1 });
AIAuditLogSchema.index({ actorId: 1, createdAt: -1 });

/**
 * =========================
 * IMMUTABILITY GUARDS
 * =========================
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
