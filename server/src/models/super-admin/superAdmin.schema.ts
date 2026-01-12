import { Schema } from "mongoose";
import { SYSTEM_ROLES } from "../../constants/roles";
import { SuperAdmin } from "./superAdmin.types";

export const SuperAdminSchema = new Schema<SuperAdmin>(
  {
    email: {
      type: String,
      required: true,
    //   unique: true,
      lowercase: true,
      trim: true,
    },

    passwordHash: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: [SYSTEM_ROLES.SUPER_ADMIN],
      default: SYSTEM_ROLES.SUPER_ADMIN,
      immutable: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastLoginAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/**
 * Indexes
 */
SuperAdminSchema.index({ email: 1 }, { unique: true });
