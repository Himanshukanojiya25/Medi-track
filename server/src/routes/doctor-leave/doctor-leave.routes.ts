import { Router } from "express";
import DoctorLeaveController from "../../controllers/doctor-leave/doctor-leave.controller";
import { devAuth } from "../../middlewares";

const router = Router();

/**
 * POST /api/v1/doctor-leaves
 */
router.post("/", devAuth, DoctorLeaveController.create);

export default router;
