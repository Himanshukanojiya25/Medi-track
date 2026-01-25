import { Types } from "mongoose";
import { BillingModel } from "../../models/billing";
import { BillingStatus } from "../../constants/status";

export default class BillingService {
  static async create(payload: Record<string, unknown>) {
    return BillingModel.create(payload);
  }

  static async getById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid Billing ID");
    }

    return BillingModel.findById(id).exec();
  }

  static async getAll() {
    return BillingModel.find().exec();
  }

  static async getByHospital(hospitalId: string) {
    if (!Types.ObjectId.isValid(hospitalId)) {
      throw new Error("Invalid Hospital ID");
    }

    return BillingModel.find({ hospitalId }).exec();
  }

  static async getByAppointment(appointmentId: string) {
    if (!Types.ObjectId.isValid(appointmentId)) {
      throw new Error("Invalid Appointment ID");
    }

    return BillingModel.find({ appointmentId }).exec();
  }

  static async updateById(
    id: string,
    payload: Partial<Record<string, unknown>>
  ) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid Billing ID");
    }

    return BillingModel.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true, // ✅ critical
    }).exec();
  }

static async markPaidById(id: string) {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error("Invalid Billing ID");
  }

  const billing = await BillingModel.findById(id);
  if (!billing) return null;

  billing.status = BillingStatus.PAID;
  billing.paidAt = new Date();
  billing.paidAmount = billing.totalAmount;
  billing.dueAmount = 0;

  return billing.save();
}


  static async cancelById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid Billing ID");
    }

    return BillingModel.findByIdAndUpdate(
      id,
      { status: BillingStatus.CANCELLED },
      {
        new: true,
        runValidators: true, // ✅ critical
      }
    ).exec();
  }
}
