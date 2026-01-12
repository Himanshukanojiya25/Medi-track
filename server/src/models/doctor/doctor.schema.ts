import { Schema } from "mongoose";
import { SYSTEM_ROLES } from "../../constants/roles";
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
    },

    phone: {
      type: String,
      trim: true,
    },

    specialization: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    /**
     * 🔐 AUTH FIELD (LOGIN DEPENDS ON THIS)
     */
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: [SYSTEM_ROLES.DOCTOR],
      default: SYSTEM_ROLES.DOCTOR,
      immutable: true,
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
