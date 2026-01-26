import { model } from "mongoose";
import { Department } from "./department.types";
import { DepartmentSchema } from "./department.schema";

export const DepartmentModel = model<Department>(
  "Department",
  DepartmentSchema
);
