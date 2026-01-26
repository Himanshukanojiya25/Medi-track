import { model } from "mongoose";
import { DoctorAvailability } from "./doctor-availability.types";
import { DoctorAvailabilitySchema } from "./doctor-availability.schema";

export const DoctorAvailabilityModel = model<DoctorAvailability>(
  "DoctorAvailability",
  DoctorAvailabilitySchema
);
