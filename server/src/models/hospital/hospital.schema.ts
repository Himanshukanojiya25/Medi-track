import { Schema } from "mongoose";
import { Hospital } from "./hospital.types";
import { HOSPITAL_STATUS } from "../../constants/status";
import { SUBSCRIPTION_PLANS } from "../../constants/subscription/plans.constants";

export const HospitalSchema = new Schema<Hospital>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    code: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      index: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      line1: { type: String, required: true },
      line2: { type: String },
      city: { type: String, required: true, index: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      postalCode: { type: String, required: true },
    },

    status: {
      type: String,
      enum: Object.values(HOSPITAL_STATUS),
      default: HOSPITAL_STATUS.ACTIVE,
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    /* ================================
       SUBSCRIPTION
    ================================= */

    plan: {
      type: String,
      enum: Object.values(SUBSCRIPTION_PLANS),
      default: SUBSCRIPTION_PLANS.FREE,
      index: true,
    },

    planActivatedAt: {
      type: Date,
      default: Date.now,
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
HospitalSchema.index({ code: 1 }, { unique: true });
HospitalSchema.index({ email: 1 }, { unique: true });
HospitalSchema.index({ "address.city": 1, isActive: 1 });
HospitalSchema.index({ status: 1, createdAt: -1 });
HospitalSchema.index({ isActive: 1, updatedAt: -1 });