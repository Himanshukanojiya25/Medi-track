import { Router } from "express";
import { DoctorProfileController } from "../../controllers/doctor-profile/doctor-profile.controller";

const router = Router();

/**
 * GET /api/v1/doctor-profile/:doctorId
 * Public route - Get complete doctor profile
 */
router.get("/:doctorId", DoctorProfileController.getProfile);

/**
 * GET /api/v1/doctor-profile/:doctorId/basic
 * Get basic doctor info
 */
router.get("/:doctorId/basic", DoctorProfileController.getBasicInfo);

/**
 * GET /api/v1/doctor-profile/:doctorId/specializations
 * Get doctor specializations
 */
router.get("/:doctorId/specializations", DoctorProfileController.getSpecializations);

/**
 * GET /api/v1/doctor-profile/:doctorId/qualifications
 * Get doctor qualifications
 */
router.get("/:doctorId/qualifications", DoctorProfileController.getQualifications);

/**
 * GET /api/v1/doctor-profile/:doctorId/availability
 * Get doctor availability slots
 */
router.get("/:doctorId/availability", DoctorProfileController.getAvailability);

/**
 * GET /api/v1/doctor-profile/:doctorId/reviews
 * Get doctor reviews with pagination
 */
router.get("/:doctorId/reviews", DoctorProfileController.getReviews);

/**
 * GET /api/v1/doctor-profile/:doctorId/stats
 * Get doctor statistics (rating, patients, experience)
 */
router.get("/:doctorId/stats", DoctorProfileController.getStats);

export default router;