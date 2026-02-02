import { Router } from "express";
import AppointmentController from "../../controllers/appointment/appointment.controller";
import AppointmentCancelController from "../../controllers/appointment/appointment.cancel.controller";
import AppointmentPatientListController from "../../controllers/appointment/appointment.patient.list.controller";
import { devAuth } from "../../middlewares/auth/dev-auth.middleware";
import AppointmentCompleteController from "../../controllers/appointment/appointment.complete.controller";

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

/**
 * ✅ PATIENT DASHBOARD – LIST OWN APPOINTMENTS
 * GET /api/v1/appointments/patient
 * ?type=UPCOMING | PAST | ALL
 */
router.get(
  "/patient",
  devAuth,
  AppointmentPatientListController.list
);

/**
 * Generic routes AFTER
 */
router.get("/", AppointmentController.getAll);
router.get("/:id", AppointmentController.getById);

/**
 * Update Appointment
 */
router.put("/:id", AppointmentController.updateById);

/**
 * ✅ PATIENT CANCEL APPOINTMENT
 * PATCH /api/v1/appointments/:id/cancel
 */
router.patch("/:id/cancel", AppointmentCancelController.cancel);

/**
 * 🔥 RESCHEDULE APPOINTMENT (FUTURE)
 */
router.patch("/:id/reschedule", devAuth, AppointmentController.reschedule);

/**
 * ✅ DOCTOR COMPLETE APPOINTMENT
 * PATCH /api/v1/appointments/:id/complete
 */
router.patch(
  "/:id/complete", devAuth, AppointmentCompleteController.complete);


export default router;
