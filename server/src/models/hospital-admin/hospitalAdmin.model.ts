import mongoose, { Model } from "mongoose";
import { HospitalAdmin } from "./hospitalAdmin.types";
import { HospitalAdminSchema } from "./hospitalAdmin.schema";

export const HospitalAdminModel: Model<HospitalAdmin> =
  mongoose.models.HospitalAdmin ||
  mongoose.model<HospitalAdmin>("HospitalAdmin", HospitalAdminSchema);
