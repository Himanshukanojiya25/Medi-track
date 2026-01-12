import { Router } from "express";

import superAdminRoutes from "./super-admin/super-admin.routes";
import hospitalRoutes from "./hospital/hospital.routes";
import hospitalAdminRoutes from "./hospital-admin/hospital-admin.routes";
import doctorRoutes from "./doctor/doctor.routes";
import patientRoutes from "./patient/patient.routes";
import appointmentRoutes from "./appointment/appointment.routes";
import billingRoutes from "./billing/billing.routes";
import prescriptionRoutes from "./prescription/prescription.routes";
import aiRoutes from "./ai";
import notificationRoutes from "./notification/notification.routes";
import doctorLeaveRoutes from "./doctor-leave/doctor-leave.routes";
import authRoutes from "./auth/auth.routes";
import { requireAuth } from "../middlewares/auth/require-auth.middleware";
import { requireRole } from "../middlewares/auth/require-role.middleware";
const router = Router();

/**
 * --------------------
 * Super Admin Routes
 * --------------------
 */
router.use("/super-admins", superAdminRoutes);

/**
 * --------------------
 * Hospital Routes
 * --------------------
 */
router.use("/hospitals", hospitalRoutes);

/**
 * --------------------
 * Hospital Admin Routes
 * --------------------
 */
router.use("/hospital-admins", hospitalAdminRoutes);

/**
 * --------------------
 * Doctor Routes
 * --------------------
 */
router.use("/doctors", doctorRoutes);

/**
 * --------------------
 * Patient Routes
 * --------------------
 */
router.use("/patients", patientRoutes);

/**
 * --------------------
 * Appointment Routes
 * --------------------
 */
router.use("/appointments", appointmentRoutes);

/**
 * --------------------
 * Billing Routes
 * --------------------
 */
router.use("/billings", billingRoutes);

/**
 * --------------------
 * Prescription Routes
 * --------------------
 */
router.use("/prescriptions", prescriptionRoutes);

/**
 * --------------------
 * AI Routes ✅
 * --------------------
 * Base: /api/v1/ai
 */
router.use("/ai", aiRoutes);


/**
 * --------------------
 * Notification Routes ✅
 * --------------------
 * Base: /api/v1/notifications
 */
router.use("/notifications", notificationRoutes);

/**
 * --------------------
 * Doctor Leave Routes ✅
 * --------------------
 * Base: /api/v1/doctor-leaves
 */
router.use("/doctor-leaves", doctorLeaveRoutes);

/**
 * --------------------
 * Auth Routes
 * --------------------
 */
router.use("/auth", authRoutes);

/**
 * --------------------
 * TEMP AUTH / RBAC TEST ROUTES
 * ❗ ONLY FOR DEVELOPMENT
 * --------------------
 */

/**
 * Test JWT authentication
 * URL: GET /api/v1/test/auth
 */
router.get(
  "/test/auth",
  requireAuth,
  (req, res) => {
    res.json({
      success: true,
      user: req.user,
    });
  }
);

/**
 * Test RBAC (SUPER ADMIN only)
 * URL: GET /api/v1/test/super-admin
 */
router.get(
  "/test/super-admin",
  requireAuth,
  requireRole("SUPER_ADMIN"),
  (_req, res) => {
    res.json({
      success: true,
      message: "Super Admin Access OK",
    });
  }
);


export default router;
