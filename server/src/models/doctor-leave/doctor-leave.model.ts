import { model } from "mongoose";
import { DoctorLeaveSchema } from "./doctor-leave.schema";
import { DoctorLeave } from "./doctor-leave.types";

export const DoctorLeaveModel = model<DoctorLeave>(
  "DoctorLeave",
  DoctorLeaveSchema
);
