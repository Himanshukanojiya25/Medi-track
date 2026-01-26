import { Router } from "express";
import DoctorController from "../../controllers/doctor/doctor.controller";
import { requireAuth } from "../../middlewares/auth/require-auth.middleware";
import { requireRole } from "../../middlewares/auth/require-role.middleware";
import { validate } from "../../middlewares/validation";
import { doctorListQuerySchema } from "../../validations/doctor/doctor.query.validation";

const router = Router();

/**
 * ============================
 * 🔥 OPTION A: LIST DOCTORS (PATIENT / PUBLIC)
 * ============================
 * GET /api/v1/doctors
 */
router.get(
  "/",
  validate({ query: doctorListQuerySchema }),
  DoctorController.listForPatients
);

/**
 * ============================
 * 👨‍⚕️ CREATE DOCTOR
 * Only HOSPITAL_ADMIN allowed
 * ============================
 */
router.post(
  "/",
  requireAuth,
  requireRole("HOSPITAL_ADMIN"),
  DoctorController.create
);

export default router;
