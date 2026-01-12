import { Schema } from "mongoose";
import { DoctorLeave } from "./doctor-leave.types";

export const DoctorLeaveSchema = new Schema<DoctorLeave>(
  {
    hospitalId: {
      type: Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
      index: true,
    },
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
      index: true,
    },
    startDate: { type: Date, required: true, index: true },
    endDate: { type: Date, required: true, index: true },
    reason: { type: String, trim: true },
  },
  { timestamps: true, versionKey: false }
);

// Prevent overlapping leaves for same doctor
DoctorLeaveSchema.index(
  { doctorId: 1, startDate: 1, endDate: 1 },
  { unique: false }
);
