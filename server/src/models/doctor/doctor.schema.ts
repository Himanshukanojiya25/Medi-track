import { Schema } from "mongoose";
import { ROLES } from "../../constants/roles";
import { DOCTOR_STATUS } from "../../constants/status";

export const DoctorSchema = new Schema(
  {
    hospitalId: {
      type: Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
      index: true,
    },

    hospitalAdminId: {
      type: Schema.Types.ObjectId,
      ref: "HospitalAdmin",
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

    phone: {
      type: String,
      trim: true,
      index: true,
    },

    specialization: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    /**
     * 🔐 AUTH FIELD
     */
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: [ROLES.DOCTOR],
      default: ROLES.DOCTOR,
      immutable: true,
      index: true,
    },

    status: {
      type: String,
      enum: Object.values(DOCTOR_STATUS),
      default: DOCTOR_STATUS.ACTIVE,
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
DoctorSchema.index({ hospitalId: 1, email: 1 }, { unique: true });
DoctorSchema.index({ hospitalId: 1, specialization: 1 });
DoctorSchema.index({ status: 1, createdAt: -1 });
DoctorSchema.index({ isActive: 1, lastLoginAt: -1 });