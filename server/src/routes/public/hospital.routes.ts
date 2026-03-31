import { Router } from "express";
import { PublicHospitalController } from "../../controllers/public";

const router = Router();

router.get("/", PublicHospitalController.getList);
router.get("/:id", PublicHospitalController.getById);
router.get("/:id/doctors", PublicHospitalController.getDoctors);

export default router;