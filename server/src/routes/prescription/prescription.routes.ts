import { Router } from "express";
import PrescriptionController from "../../controllers/prescription/prescription.controller";

const router = Router();

/**
 * Prescription Routes
 * -------------------
 * Base path: /prescriptions
 */

/**
 * Create Prescription
 */
router.post("/", PrescriptionController.create);

/**
 * Specific routes FIRST
 */
router.get("/patient/:patientId", PrescriptionController.getByPatient);
router.get("/doctor/:doctorId", PrescriptionController.getByDoctor);

/**
 * Generic routes AFTER
 */
router.get("/:id", PrescriptionController.getById);

router.put("/:id", PrescriptionController.updateById);

router.patch("/:id/cancel", PrescriptionController.cancelById);

export default router;
