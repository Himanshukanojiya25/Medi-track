import { Router } from "express";

/**
 * ============================
 * ROUTE IMPORTS
 * ============================
 */
import authRoutes from "./auth/auth.routes";

import superAdminRoutes from "./super-admin/super-admin.routes";
import hospitalOnboardingRoutes from "./super-admin/hospital-onboarding.routes";

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
import doctorAvailabilityRoutes from "./doctor-availability/doctor-availability.routes";
import publicRoutes from "./public";  // 👈 ADD THIS

/**
 * 🔥 NEW: DEPARTMENT ROUTES
 */
import departmentRoutes from "./department/department.routes";

import { requireAuth } from "../middlewares/auth/require-auth.middleware";
import { requireRole } from "../middlewares/auth/require-role.middleware";

const router = Router();

/**
 * ============================
 * 🔓 AUTH ROUTES (NO AUTH)
 * ============================
 */
router.use("/auth", authRoutes);

/**
 * ============================
 * 👑 SUPER ADMIN ROUTES
 * ============================
 */
router.use("/super-admins", superAdminRoutes);

/**
 * 🔥 SUPER ADMIN – HOSPITAL ONBOARDING
 * BASE: /api/v1/super-admin/hospitals
 */
router.use("/super-admin/hospitals", hospitalOnboardingRoutes);

/**
 * ============================
 * 🏥 HOSPITAL ROUTES
 * ============================
 */
router.use("/hospitals", hospitalRoutes);

/**
 * ============================
 * 🧑‍💼 HOSPITAL ADMIN ROUTES
 * ============================
 */
router.use("/hospital-admins", hospitalAdminRoutes);

/**
 * ============================
 * 🧑‍⚕️ DOCTOR ROUTES
 * ============================
 */
router.use("/doctors", doctorRoutes);

/**
 * ============================
 * 🧑‍🤝‍🧑 PATIENT ROUTES
 * ============================
 */
router.use("/patients", patientRoutes);

/**
 * ============================
 * 📅 APPOINTMENTS
 * ============================
 */
router.use("/appointments", appointmentRoutes);

/**
 * ============================
 * 💳 BILLING
 * ============================
 */
router.use("/billings", billingRoutes);

/**
 * ============================
 * 💊 PRESCRIPTIONS
 * ============================
 */
router.use("/prescriptions", prescriptionRoutes);

/**
 * ============================
 * 🤖 AI MODULE
 * ============================
 */
router.use("/ai", aiRoutes);

/**
 * ============================
 * 🔔 NOTIFICATIONS
 * ============================
 */
router.use("/notifications", notificationRoutes);

/**
 * ============================
 * 🛑 DOCTOR LEAVE
 * ============================
 */
router.use("/doctor-leaves", doctorLeaveRoutes);

/**
 * ============================
 * 🕒 DOCTOR AVAILABILITY
 * ============================
 */
router.use("/doctor-availability", doctorAvailabilityRoutes);

/**
 * ============================
 * 🏥 DEPARTMENTS  🔥🔥🔥
 * BASE: /api/v1/departments
 */
router.use("/departments", departmentRoutes);

/**
 * ============================
 * 🕒 Public
 * ============================
 */
router.use("/public", publicRoutes);  // 👈 ADD THIS

/**
 * ============================
 * 🧪 TEST ROUTES
 * ============================
 */
router.get("/test/auth", requireAuth, (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

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
