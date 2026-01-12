import mongoose, { Model } from "mongoose";
import { Hospital } from "./hospital.types";
import { HospitalSchema } from "./hospital.schema";

export const HospitalModel: Model<Hospital> =
  mongoose.models.Hospital ||
  mongoose.model<Hospital>("Hospital", HospitalSchema);
