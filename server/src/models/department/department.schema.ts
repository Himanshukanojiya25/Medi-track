import { Schema } from "mongoose";
import { Department } from "./department.types";

export const DepartmentSchema = new Schema<Department>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "SuperAdmin",
    },
  },
  {
    timestamps: true,
  }
);
