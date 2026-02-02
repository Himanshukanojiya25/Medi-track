import { Router } from "express";
import AppointmentBookController from "../../controllers/appointment/appointment.book.controller";
import { devAuth } from "../../middlewares/auth/dev-auth.middleware";

const router = Router();

/**
 * POST /api/v1/patient/appointments
 */
router.post(
  "/",
  devAuth,
  AppointmentBookController.book
);

export default router;
