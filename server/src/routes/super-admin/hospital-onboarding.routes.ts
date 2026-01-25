import { Router } from 'express';
import { HospitalOnboardingController } from '../../controllers/super-admin/hospital-onboarding.controller';

// ✅ DEFAULT IMPORT (VERY IMPORTANT)
import authenticate from '../../middlewares/auth/authenticate.middleware';
import { requireSuperAdmin } from '../../middlewares/super-admin/require-super-admin.middleware';

// ✅ validate IS NAMED EXPORT
import { validate } from '../../middlewares/validation/zod-validation.middleware';

import {
  hospitalIdParamSchema,
  rejectHospitalSchema,
} from '../../validations/super-admin/hospital-onboarding.validation';

const router = Router();

/**
 * All routes below require:
 * 1. Authenticated user
 * 2. SUPER_ADMIN role
 */
router.use(authenticate, requireSuperAdmin);

router.post(
  '/:hospitalId/approve',
  validate({ params: hospitalIdParamSchema }),
  HospitalOnboardingController.approve
);

router.post(
  '/:hospitalId/reject',
  validate({
    params: hospitalIdParamSchema,
    body: rejectHospitalSchema,
  }),
  HospitalOnboardingController.reject
);

router.post(
  '/:hospitalId/suspend',
  validate({ params: hospitalIdParamSchema }),
  HospitalOnboardingController.suspend
);

export default router;
