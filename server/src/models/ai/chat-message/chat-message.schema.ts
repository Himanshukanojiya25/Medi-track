// src/models/ai/chat-message/chat-message.schema.ts

import { Schema } from "mongoose";

export const ChatMessageSchema = new Schema(
  {
    hospitalId: {
      type: Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
      index: true,
    },

    sessionId: {
      type: Schema.Types.ObjectId,
      ref: "ChatSession",
      required: true,
      index: true,
    },

    role: {
      type: String,
      required: true,
      enum: ["system", "user", "assistant"],
      index: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    sequence: {
      type: Number,
      required: true,
      min: 1,
    },

    status: {
      type: String,
      enum: ["sent", "failed", "redacted"],
      default: "sent",
      index: true,
    },

    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/**
 * =========================
 * PHASE 3.1 — DB INDEXING
 * =========================
 */

/**
 * Enforce message order inside a session
 */
ChatMessageSchema.index(
  { sessionId: 1, sequence: 1 },
  { unique: true }
);

/**
 * Fast chat loading (conversation replay)
 */
ChatMessageSchema.index({
  sessionId: 1,
  createdAt: 1,
});

/**
 * Hospital-wise AI usage queries
 */
ChatMessageSchema.index({
  hospitalId: 1,
  createdAt: -1,
});

/**
 * Role-based message filtering (system / user / assistant)
 */
ChatMessageSchema.index({
  role: 1,
  createdAt: -1,
});

/**
 * Status-based retries / audits
 */
ChatMessageSchema.index({
  status: 1,
  createdAt: -1,
});
