import { Router } from "express";
import DoctorController from "../../controllers/doctor/doctor.controller";
import { requireAuth } from "../../middlewares/auth/require-auth.middleware";
import { authorize } from "../../middlewares/auth/authorize.middleware";

const router = Router();

/**
 * Create Doctor
 * Only hospital-admin allowed
 */
router.post(
  "/",
  requireAuth,                  // ✅ JWT → req.user
  authorize("hospital-admin"),  // ✅ RBAC
  DoctorController.create
);

export default router;
