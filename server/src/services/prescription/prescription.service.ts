import { Types } from "mongoose";
import { PrescriptionModel } from "../../models/prescription";
import { PrescriptionStatus } from "../../constants/status";

export default class PrescriptionService {
  /**
   * Create prescription
   */
  static async create(payload: Record<string, any>) {
    return PrescriptionModel.create(payload);
  }

  /**
   * Get prescription by ID
   */
  static async getById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid Prescription ID");
    }
    return PrescriptionModel.findById(id);
  }

  /**
   * ✅ Get prescriptions by patient
   */
  static async getByPatient(patientId: string) {
    if (!Types.ObjectId.isValid(patientId)) {
      throw new Error("Invalid Patient ID");
    }

    return PrescriptionModel.find({ patientId }).exec();
  }

  /**
   * ✅ Get prescriptions by doctor
   */
  static async getByDoctor(doctorId: string) {
    if (!Types.ObjectId.isValid(doctorId)) {
      throw new Error("Invalid Doctor ID");
    }

    return PrescriptionModel.find({ doctorId }).exec();
  }

  /**
   * Update prescription
   */
  static async updateById(id: string, payload: { notes?: string }) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid Prescription ID");
    }

    const rx = await PrescriptionModel.findById(id);
    if (!rx) return null;

    if (payload.notes !== undefined) {
      rx.notes = payload.notes;
    }

    await rx.save();
    return rx;
  }

  /**
   * Cancel prescription
   */
  static async cancelById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid Prescription ID");
    }

    const rx = await PrescriptionModel.findById(id);
    if (!rx) return null;

    rx.status = PrescriptionStatus.CANCELLED;

    await rx.save();
    return rx;
  }
}
