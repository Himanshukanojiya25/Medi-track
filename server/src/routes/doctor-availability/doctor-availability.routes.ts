import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth/auth.middleware";
import { requireRole } from "../../middlewares/auth/require-role.middleware";
import { validate } from "../../middlewares/validation";
import {
  upsertDoctorAvailabilityController,
  getDoctorAvailabilityController,
} from "../../controllers/doctor-availability/doctor-availability.controller";
import { upsertDoctorAvailabilitySchema } from "../../validations/doctor-availability/doctor-availability.validation";

const router = Router();

/**
 * DOCTOR → SET / UPDATE AVAILABILITY
 */
router.put(
  "/me",
  authMiddleware,
  requireRole("DOCTOR"),
  validate(upsertDoctorAvailabilitySchema),
  upsertDoctorAvailabilityController
);

/**
 * PUBLIC → GET DOCTOR AVAILABILITY
 */
router.get(
  "/:doctorId",
  authMiddleware,
  getDoctorAvailabilityController
);

export default router;
