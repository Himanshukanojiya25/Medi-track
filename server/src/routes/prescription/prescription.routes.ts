import { Router } from "express";

/**
 * 🔴 OLD / GENERIC CONTROLLER (PHASE-1 STYLE)
 * ❗ We keep this for backward compatibility
 */
import PrescriptionController from "../../controllers/prescription/prescription.controller";

/**
 * 🟢 NEW / STRICT CONTROLLERS (PHASE-2.3)
 */
import PrescriptionCreateController from "../../controllers/prescription/prescription.create.controller";
import PrescriptionGetByAppointmentController from "../../controllers/prescription/prescription.get-by-appointment.controller";
import PrescriptionPatientListController from "../../controllers/prescription/prescription.patient.list.controller";

/**
 * Auth middleware (already exists in project)
 */
import { devAuth } from "../../middlewares/auth/dev-auth.middleware";

const router = Router();

/**
 * ======================================================
 * Prescription Routes
 * Base path: /prescriptions
 * ======================================================
 */

/**
 * ======================================================
 * 🟢 PHASE-2.3 — STRICT MEDICAL ROUTES (PREFERRED)
 * ======================================================
 */

/**
 * ✅ CREATE PRESCRIPTION
 * Doctor only
 * Appointment must be COMPLETED
 * Immutable record
 *
 * POST /api/v1/prescriptions
 */
router.post(
  "/",
  devAuth,
  PrescriptionCreateController.create
);

/**
 * ✅ GET PRESCRIPTION BY APPOINTMENT
 * Doctor (own) or Patient (own)
 *
 * GET /api/v1/prescriptions/appointment/:appointmentId
 */
router.get(
  "/appointment/:appointmentId",
  devAuth,
  PrescriptionGetByAppointmentController.get
);

/**
 * ✅ PATIENT — LIST OWN PRESCRIPTIONS
 *
 * GET /api/v1/patients/me/prescriptions
 * (mounted via patients route OR proxy here)
 */
router.get(
  "/me/patient",
  devAuth,
  PrescriptionPatientListController.list
);

/**
 * ======================================================
 * ⚠️ LEGACY / GENERIC ROUTES (DO NOT USE FOR NEW FLOWS)
 * Kept only to avoid breaking existing code
 * ======================================================
 */

/**
 * ❌ GENERIC CREATE (NOT MEDICAL-SAFE)
 */
router.post("/legacy", PrescriptionController.create);

/**
 * ❌ GENERIC LISTING
 */
router.get("/patient/:patientId", PrescriptionController.getByPatient);
router.get("/doctor/:doctorId", PrescriptionController.getByDoctor);

/**
 * ❌ GENERIC READ
 */
router.get("/:id", PrescriptionController.getById);

/**
 * ❌ GENERIC UPDATE (NOT ALLOWED MEDICALLY)
 */
router.put("/:id", PrescriptionController.updateById);

/**
 * ❌ GENERIC CANCEL (NOT ALLOWED MEDICALLY)
 */
router.patch("/:id/cancel", PrescriptionController.cancelById);

export default router;
