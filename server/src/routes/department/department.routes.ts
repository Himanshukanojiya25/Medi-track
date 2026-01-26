import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth/auth.middleware";
import {
  createDepartmentController,
  getAllDepartmentsController,
  updateDepartmentController,
} from "../../controllers/department/department.controller";
import { validate } from "../../middlewares/validation";
import {
  createDepartmentSchema,
  updateDepartmentSchema,
} from "../../validations/department/department.validation";

const router = Router();

/**
 * GET ALL DEPARTMENTS
 * Accessible to any authenticated user
 */
router.get("/", authMiddleware, getAllDepartmentsController);

/**
 * CREATE DEPARTMENT
 * SUPER_ADMIN only (checked in controller)
 */
router.post(
  "/",
  authMiddleware,
  validate(createDepartmentSchema),
  createDepartmentController
);

/**
 * UPDATE DEPARTMENT
 * SUPER_ADMIN only (checked in controller)
 */
router.patch(
  "/:id",
  authMiddleware,
  validate(updateDepartmentSchema),
  updateDepartmentController
);

export default router;
