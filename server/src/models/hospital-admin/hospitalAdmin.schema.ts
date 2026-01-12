import { Schema } from "mongoose";
import { HospitalAdmin } from "./hospitalAdmin.types";
import { SYSTEM_ROLES } from "../../constants/roles";
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
    },

    passwordHash: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: [SYSTEM_ROLES.HOSPITAL_ADMIN],
      default: SYSTEM_ROLES.HOSPITAL_ADMIN,
      immutable: true,
    },

    status: {
      type: String,
      enum: Object.values(HOSPITAL_ADMIN_STATUS),
      default: HOSPITAL_ADMIN_STATUS.ACTIVE,
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
 * Indexes (production-safe)
 * One hospital → unique admin email
 */
HospitalAdminSchema.index(
  { hospitalId: 1, email: 1 },
  { unique: true }
);
