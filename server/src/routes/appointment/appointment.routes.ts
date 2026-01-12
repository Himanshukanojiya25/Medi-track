import { Router } from "express";
import AppointmentController from "../../controllers/appointment/appointment.controller";
import { devAuth } from "../../middlewares/auth/dev-auth.middleware";

const router = Router();

/**
 * Appointment Routes
 * ------------------
 * Base path: /appointments
 */

/**
 * Create Appointment
 */
router.post("/", AppointmentController.create);

/**
 * Specific filters FIRST
 */
router.get("/hospital/:hospitalId", AppointmentController.getByHospital);
router.get("/doctor/:doctorId", AppointmentController.getByDoctor);
router.get("/patient/:patientId", AppointmentController.getByPatient);

/**
 * Generic routes AFTER
 */
router.get("/", AppointmentController.getAll);
router.get("/:id", AppointmentController.getById);

/**
 * Update / Cancel / Reschedule
 */
router.put("/:id", AppointmentController.updateById);

router.patch("/:id/cancel", AppointmentController.cancelById);

/**
 * 🔥 RESCHEDULE APPOINTMENT (NEW)
 */
router.patch(
  "/:id/reschedule",
  devAuth,
  AppointmentController.reschedule
);

export default router;
