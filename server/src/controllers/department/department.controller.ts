import { Request, Response } from "express";
import {
  createDepartmentService,
  getAllDepartmentsService,
  updateDepartmentService,
} from "../../services/department/department.service";
import { ROLES } from "../../constants/roles";

export async function createDepartmentController(
  req: Request,
  res: Response
) {
  if (req.user?.role !== ROLES.SUPER_ADMIN) {
    return res.status(403).json({
      success: false,
      message: "Access denied",
    });
  }

  const department = await createDepartmentService({
    name: req.body.name,
    description: req.body.description,
    createdBy: req.user.id,
  });

  return res.status(201).json({
    success: true,
    data: department,
  });
}

export async function getAllDepartmentsController(
  _req: Request,
  res: Response
) {
  const departments = await getAllDepartmentsService();

  return res.status(200).json({
    success: true,
    data: departments,
  });
}

export async function updateDepartmentController(
  req: Request,
  res: Response
) {
  if (req.user?.role !== ROLES.SUPER_ADMIN) {
    return res.status(403).json({
      success: false,
      message: "Access denied",
    });
  }

  const department = await updateDepartmentService(
    req.params.id,
    req.body
  );

  return res.status(200).json({
    success: true,
    data: department,
  });
}
