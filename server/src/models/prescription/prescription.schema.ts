import { Schema } from "mongoose";
import { IPrescription } from "./prescription.types";
import { PrescriptionStatus } from "../../constants/status";

export const PrescriptionSchema = new Schema<IPrescription>(
  {
    hospitalId: {
      type: Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
      index: true,
    },
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
      index: true,
    },
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
      index: true,
    },
    appointmentId: {
      type: Schema.Types.ObjectId,
      ref: "Appointment",
      index: true,
    },

  medicines: {
  type: [
    {
      name: { type: String, required: true, trim: true },
      dosage: { type: String, required: true, trim: true },
      frequency: { type: String, required: true, trim: true },
      durationDays: { type: Number, required: true, min: 1 },
      instructions: { type: String, trim: true },
    },
  ],
  validate: {
    validator: (arr: any[]) => Array.isArray(arr) && arr.length > 0,
    message: "Prescription must contain at least one medicine",
  },
},


    notes: {
      type: String,
      trim: true,
      maxlength: 2000,
    },

    status: {
      type: String,
      enum: Object.values(PrescriptionStatus),
      default: PrescriptionStatus.ACTIVE,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// ✅ One ACTIVE prescription per doctor per appointment
PrescriptionSchema.index(
  { doctorId: 1, appointmentId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      appointmentId: { $exists: true },
      status: PrescriptionStatus.ACTIVE,
    },
  }
);


// ✅ One ACTIVE prescription per patient per appointment