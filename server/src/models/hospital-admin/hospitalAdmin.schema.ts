import { Schema } from "mongoose";
import { HospitalAdmin } from "./hospitalAdmin.types";
import { ROLES } from "../../constants/roles";
import { HOSPITAL_ADMIN_STATUS } from "../../constants/status";

export const HospitalAdminSchema = new Schema<HospitalAdmin>(
  {
    hospitalId: {
      type: Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    passwordHash: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: [ROLES.HOSPITAL_ADMIN],
      default: ROLES.HOSPITAL_ADMIN,
      immutable: true,
      index: true,
    },

    status: {
      type: String,
      enum: Object.values(HOSPITAL_ADMIN_STATUS),
      default: HOSPITAL_ADMIN_STATUS.ACTIVE,
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
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
 * =========================
 * INDEXES
 * =========================
 */
HospitalAdminSchema.index({ hospitalId: 1, email: 1 }, { unique: true });
HospitalAdminSchema.index({ status: 1, createdAt: -1 });
HospitalAdminSchema.index({ isActive: 1, lastLoginAt: -1 });