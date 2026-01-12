import { Router } from "express";
import PatientController from "../../controllers/patient/patient.controller";

const router = Router();

/**
 * Patient Routes
 * --------------
 * Base path: /patients
 */

router.post("/", PatientController.create);

/**
 * Specific routes FIRST
 */
router.get("/hospital/:hospitalId", PatientController.getByHospital);

/**
 * Generic routes AFTER
 */
router.get("/", PatientController.getAll);
router.get("/:id", PatientController.getById);

router.put("/:id", PatientController.updateById);
router.patch("/:id/deactivate", PatientController.deactivateById);

export default router;
