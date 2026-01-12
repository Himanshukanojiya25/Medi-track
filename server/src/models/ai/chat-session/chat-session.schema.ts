// src/models/ai/chat-session/chat-session.schema.ts

import { Schema } from "mongoose";

export const ChatSessionSchema = new Schema(
  {
    hospitalId: {
      type: Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
      index: true,
    },

    actorId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    actorRole: {
      type: String,
      required: true,
      enum: ["super_admin", "hospital_admin", "doctor", "patient"],
      index: true,
    },

    status: {
      type: String,
      enum: ["active", "closed", "expired"],
      default: "active",
      index: true,
    },

    startedAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },

    endedAt: {
      type: Date,
    },

    context: {
      type: Schema.Types.Mixed,
      default: {},
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      required: true,
    },

    updatedBy: {
      type: Schema.Types.ObjectId,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/**
 * Guards
 */
ChatSessionSchema.pre("save", function (next) {
  if (this.status !== "active" && !this.endedAt) {
    this.endedAt = new Date();
  }
  next();
});
