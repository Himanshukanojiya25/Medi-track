import { Schema } from "mongoose";
import { DoctorAvailability } from "./doctor-availability.types";

const TimeSlotSchema = new Schema(
  {
    start: { type: String, required: true },
    end: { type: String, required: true },
  },
  { _id: false }
);

const WeeklyAvailabilitySchema = new Schema(
  {
    dayOfWeek: { type: Number, required: true, min: 0, max: 6 },
    slots: { type: [TimeSlotSchema], default: [] },
  },
  { _id: false }
);

export const DoctorAvailabilitySchema = new Schema<DoctorAvailability>(
  {
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
      unique: true, // 🔥 one availability per doctor
    },
    slotDurationMinutes: {
      type: Number,
      required: true,
      min: 5,
      max: 120,
    },
    weeklyAvailability: {
      type: [WeeklyAvailabilitySchema],
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);
