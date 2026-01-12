import { Types } from "mongoose";
import { BillingModel } from "../../models/billing";
import { BillingStatus } from "../../constants/status";

/**
 * Billing Service
 * ---------------
 * Pure business logic layer.
 * No Express, no req/res.
 */
export default class BillingService {
  /**
   * Create Billing
   */
  static async create(payload: Record<string, unknown>) {
    const billing = new BillingModel(payload);
    return billing.save();
  }

  /**
   * Get Billing by ID
   */
  static async getById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid Billing ID");
    }

    return BillingModel.findById(id).exec();
  }

  /**
   * Get All Billings
   */
  static async getAll() {
    return BillingModel.find().exec();
  }

  /**
   * Get Billings by Hospital
   */
  static async getByHospital(hospitalId: string) {
    if (!Types.ObjectId.isValid(hospitalId)) {
      throw new Error("Invalid Hospital ID");
    }

    return BillingModel.find({ hospitalId }).exec();
  }

  /**
   * Get Billings by Appointment
   */
  static async getByAppointment(appointmentId: string) {
    if (!Types.ObjectId.isValid(appointmentId)) {
      throw new Error("Invalid Appointment ID");
    }

    return BillingModel.find({ appointmentId }).exec();
  }

  /**
   * Update Billing by ID
   */
  static async updateById(
    id: string,
    payload: Partial<Record<string, unknown>>
  ) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid Billing ID");
    }

    return BillingModel.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    }).exec();
  }

  /**
   * Mark Billing as Paid
   */
  static async markPaidById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid Billing ID");
    }

    return BillingModel.findByIdAndUpdate(
      id,
      {
        status: BillingStatus.PAID, // ✅ "paid"
        paidAt: new Date(),
      },
      { new: true }
    ).exec();
  }

  /**
   * Cancel Billing
   */
  static async cancelById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid Billing ID");
    }

    return BillingModel.findByIdAndUpdate(
      id,
      {
        status: BillingStatus.CANCELLED, // ✅ "cancelled"
      },
      { new: true }
    ).exec();
  }
}
