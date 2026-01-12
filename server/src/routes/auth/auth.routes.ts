import { Router } from "express";
import { loginController } from "../../controllers/auth/auth.controller";
import { registerPatientController } from "../../controllers/auth/register-patient.controller";
import {
  loginSchema,
  registerPatientSchema,
} from "../../validations/auth";
import { validate } from "../../middlewares/validation";

const router = Router();

/**
 * POST /auth/login
 */
router.post("/login", validate(loginSchema), loginController);

/**
 * POST /auth/register/patient
 */
router.post(
  "/register/patient",
  validate(registerPatientSchema),
  registerPatientController
);

export default router;
