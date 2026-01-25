import { Schema } from "mongoose";
import { IPatient } from "./patient.types";
import { PatientStatus } from "../../constants/status";

export const PatientSchema = new Schema<IPatient>(
  {
    hospitalId: {
      type: Schema.Types.ObjectId,
      ref: "Hospital",
      index: true,
      required: function () {
        return this.createdByHospitalAdminId != null;
      },
    },

    createdByHospitalAdminId: {
      type: Schema.Types.ObjectId,
      ref: "HospitalAdmin",
      index: true,
      required: false, // self-signup allowed
    },

    firstName: {
      type: String,
      trim: true,
      minlength: 2,
      maxlength: 50,
      required: function () {
        return this.createdByHospitalAdminId != null;
      },
    },

    lastName: {
      type: String,
      trim: true,
      minlength: 2,
      maxlength: 50,
      required: function () {
        return this.createdByHospitalAdminId != null;
      },
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      index: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    /**
     * 🔐 AUTH FIELD (LOCKED)
     */
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },

    dateOfBirth: {
      type: Date,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },

    bloodGroup: {
      type: String,
      trim: true,
    },

    emergencyContact: {
      name: { type: String, trim: true },
      phone: { type: String, trim: true },
      relation: { type: String, trim: true },
    },

    status: {
      type: String,
      enum: Object.values(PatientStatus),
      default: PatientStatus.ACTIVE,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/**
 * One phone per hospital
 * Self-signup patients (hospitalId = null) ignored
 */
PatientSchema.index(
  { hospitalId: 1, phone: 1 },
  { unique: true, sparse: true }
);
