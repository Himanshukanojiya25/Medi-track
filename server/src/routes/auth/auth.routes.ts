import { Router } from "express";

import {
  loginController,
  refreshTokenController,
  logoutController,
  logoutAllController,
} from "../../controllers/auth/auth.controller";

import { registerPatientController } from "../../controllers/auth/register-patient.controller";

import { validate } from "../../middlewares/validation";
import { authMiddleware } from "../../middlewares/auth/auth.middleware";

import { loginSchema } from "../../validations/auth";
import { refreshTokenSchema } from "../../validations/auth/refresh-token.validation";
import { logoutSchema } from "../../validations/auth/logout.validation";
import { registerPatientSchema } from "../../validations/auth/register-patient.validation";

const router = Router();

/**
 * ============================
 * 🔐 AUTH ROUTES
 * BASE: /api/v1/auth
 * ============================
 */

/**
 * 🔐 LOGIN (ALL ROLES)
 */
router.post(
  "/login",
  validate(loginSchema),
  loginController
);

/**
 * 🔁 REFRESH TOKEN
 */
router.post(
  "/refresh",
  validate(refreshTokenSchema),
  refreshTokenController
);

/**
 * 🔓 LOGOUT (SINGLE DEVICE)
 */
router.post(
  "/logout",
  validate(logoutSchema),
  logoutController
);

/**
 * 🔓 LOGOUT (ALL DEVICES)
 */
router.post(
  "/logout-all",
  authMiddleware,
  logoutAllController
);

/**
 * 🧑‍🤝‍🧑 PATIENT SELF REGISTER
 */
router.post(
  "/register/patient",
  validate(registerPatientSchema),
  registerPatientController
);

/**
 * 👤 GET CURRENT USER (AUTH BOOTSTRAP)
 * GET /api/v1/auth/me
 */
router.get(
  "/me",
  authMiddleware,
  (req, res) => {
    res.json({
      success: true,
      data: req.user,
    });
  }
);

/**
 * ✅ CRITICAL EXPORT
 */
export default router;
