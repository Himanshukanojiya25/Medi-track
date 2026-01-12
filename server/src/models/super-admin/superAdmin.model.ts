import mongoose, { Model } from "mongoose";
import { SuperAdmin } from "./superAdmin.types";
import { SuperAdminSchema } from "./superAdmin.schema";

export const SuperAdminModel: Model<SuperAdmin> =
  mongoose.models.SuperAdmin ||
  mongoose.model<SuperAdmin>("SuperAdmin", SuperAdminSchema);
