import { Schema } from "mongoose";
import { AIUsageCounter } from "./ai-usage-counter.types";

export const AIUsageCounterSchema = new Schema<AIUsageCounter>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    hospitalId: {
      type: Schema.Types.ObjectId,
      index: true,
    },

    role: {
      type: String,
      enum: ["patient", "doctor", "hospital-admin", "super-admin"],
      required: true,
      index: true,
    },

    date: {
      type: String,
      required: true,
      index: true,
    },

    totalRequests: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalTokensUsed: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

AIUsageCounterSchema.index({ userId: 1, date: 1 }, { unique: true });
AIUsageCounterSchema.index({ hospitalId: 1, date: 1 });
