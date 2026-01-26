import { Router } from "express";
import { HospitalOnboardingController } from "../../controllers/super-admin/hospital-onboarding.controller";

import { requireAuth } from "../../middlewares/auth/require-auth.middleware";
import { requireSuperAdmin } from "../../middlewares/super-admin/require-super-admin.middleware";

import { validate } from "../../middlewares/validation/zod-validation.middleware";

import {
  hospitalIdParamSchema,
  rejectHospitalSchema,
} from "../../validations/super-admin/hospital-onboarding.validation";

const router = Router();

/**
 * ============================
 * 🔐 SUPER ADMIN ONLY ROUTES
 * ============================
 */
router.use(requireAuth, requireSuperAdmin);

/**
 * ✅ APPROVE HOSPITAL
 * POST /api/v1/super-admin/hospitals/:hospitalId/approve
 */
router.post(
  "/:hospitalId/approve",
  validate({ params: hospitalIdParamSchema }),
  HospitalOnboardingController.approve
);

/**
 * ❌ REJECT HOSPITAL
 * POST /api/v1/super-admin/hospitals/:hospitalId/reject
 */
router.post(
  "/:hospitalId/reject",
  validate({
    params: hospitalIdParamSchema,
    body: rejectHospitalSchema,
  }),
  HospitalOnboardingController.reject
);

/**
 * 🛑 SUSPEND HOSPITAL
 * POST /api/v1/super-admin/hospitals/:hospitalId/suspend
 */
router.post(
  "/:hospitalId/suspend",
  validate({ params: hospitalIdParamSchema }),
  HospitalOnboardingController.suspend
);

export default router;
