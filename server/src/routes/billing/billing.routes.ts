import { Router } from "express";
import BillingController from "../../controllers/billing/billing.controller";

const router = Router();

/**
 * Billing Routes
 * --------------
 * Base path: /billings
 */

/**
 * Create Billing
 */
router.post("/", BillingController.create);

/**
 * Specific filters FIRST
 */
router.get("/hospital/:hospitalId", BillingController.getByHospital);
router.get(
  "/appointment/:appointmentId",
  BillingController.getByAppointment
);

/**
 * Generic routes AFTER
 */
router.get("/", BillingController.getAll);
router.get("/:id", BillingController.getById);

/**
 * Update / Payment / Cancel
 */
router.put("/:id", BillingController.updateById);
router.patch("/:id/pay", BillingController.markPaidById);
router.patch("/:id/cancel", BillingController.cancelById);

export default router;
