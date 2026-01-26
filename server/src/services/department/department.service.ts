import { Types } from "mongoose";
import { DepartmentModel } from "../../models/department";

/**
 * INPUT TYPES
 * Controllers always pass STRING IDs
 */
interface CreateDepartmentInput {
  name: string;
  description?: string;
  createdBy: string; // req.user.id (string)
}

interface UpdateDepartmentInput {
  name?: string;
  description?: string;
  isActive?: boolean;
}

/**
 * CREATE DEPARTMENT
 * Only SUPER_ADMIN should call this (enforced in controller)
 */
export async function createDepartmentService(
  input: CreateDepartmentInput
) {
  const existingDepartment = await DepartmentModel.findOne({
    name: input.name,
  });

  if (existingDepartment) {
    throw new Error("Department already exists");
  }

  const department = await DepartmentModel.create({
    name: input.name,
    description: input.description,
    createdBy: new Types.ObjectId(input.createdBy),
  });

  return department;
}

/**
 * GET ALL DEPARTMENTS
 */
export async function getAllDepartmentsService() {
  return DepartmentModel.find().sort({ name: 1 });
}

/**
 * UPDATE DEPARTMENT
 */
export async function updateDepartmentService(
  departmentId: string,
  updates: UpdateDepartmentInput
) {
  const department = await DepartmentModel.findByIdAndUpdate(
    new Types.ObjectId(departmentId),
    updates,
    { new: true }
  );

  if (!department) {
    throw new Error("Department not found");
  }

  return department;
}
