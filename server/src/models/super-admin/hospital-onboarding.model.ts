import { Schema, model } from "mongoose";
import { HospitalOnboardingStatus } from "../../constants/super-admin";

const hospitalOnboardingSchema = new Schema(
  {
    hospitalId: {
      type: Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
      unique: true,
    },

    status: {
      type: String,
      enum: Object.values(HospitalOnboardingStatus),
      default: HospitalOnboardingStatus.PENDING,
      required: true,
    },

    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: "SuperAdmin",
    },
    approvedAt: Date,

    rejectedBy: {
      type: Schema.Types.ObjectId,
      ref: "SuperAdmin",
    },
    rejectedAt: Date,
    rejectionReason: String,

    suspendedBy: {
      type: Schema.Types.ObjectId,
      ref: "SuperAdmin",
    },
    suspendedAt: Date,
  },
  { timestamps: true }
);

export const HospitalOnboardingModel = model(
  "HospitalOnboarding",
  hospitalOnboardingSchema
);
