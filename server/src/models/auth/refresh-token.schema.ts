import { Schema } from "mongoose";
import { RefreshTokenStatus } from "./refresh-token.types";

export const RefreshTokenSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    tokenHash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "REVOKED"] satisfies RefreshTokenStatus[],
      default: "ACTIVE",
      index: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },

    // ✅ ADD THIS
    revokedAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);
