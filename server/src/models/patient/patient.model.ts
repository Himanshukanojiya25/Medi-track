import mongoose, { Model } from "mongoose";
import { IPatient } from "./patient.types";
import { PatientSchema } from "./patient.schema";

export const PatientModel: Model<IPatient> =
  mongoose.models.Patient ||
  mongoose.model<IPatient>("Patient", PatientSchema);
