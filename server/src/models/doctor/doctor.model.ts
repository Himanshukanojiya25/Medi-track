import mongoose, { Model } from "mongoose";
import { Doctor } from "./doctor.types";
import { DoctorSchema } from "./doctor.schema";

export const DoctorModel: Model<Doctor> =
  mongoose.models.Doctor ||
  mongoose.model<Doctor>("Doctor", DoctorSchema);
