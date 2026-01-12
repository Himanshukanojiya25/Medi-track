import { Router } from "express";
import HospitalController from "../../controllers/hospital/hospital.controller";

const router = Router();

/**
 * Hospital Routes
 */
router.post("/", HospitalController.create);
router.get("/", HospitalController.getAll);
router.get("/:id", HospitalController.getById);
router.put("/:id", HospitalController.updateById);
router.patch("/:id/deactivate", HospitalController.deactivateById);

export default router;
