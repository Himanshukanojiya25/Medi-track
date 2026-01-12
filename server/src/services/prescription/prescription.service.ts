import { Types } from "mongoose";
import { PrescriptionModel } from "../../models/prescription";
import { PrescriptionStatus } from "../../constants/status";

/**
 * Prescription Service
 * --------------------
 * Pure business logic layer.
 * No Express, no req/res.
 */
export default class PrescriptionService {
  /**
   * Create Prescription
   */
  static async create(payload: Record<string, unknown>) {
    const prescription = new PrescriptionModel(payload);
    return prescription.save();
  }

  /**
   * Get Prescription by ID
   */
  static async getById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid Prescription ID");
    }

    return PrescriptionModel.findById(id).exec();
  }

  /**
   * Get Prescriptions by Patient
   */
  static async getByPatient(patientId: string) {
    if (!Types.ObjectId.isValid(patientId)) {
      throw new Error("Invalid Patient ID");
    }

    return PrescriptionModel.find({ patientId }).exec();
  }

  /**
   * Get Prescriptions by Doctor
   */
  static async getByDoctor(doctorId: string) {
    if (!Types.ObjectId.isValid(doctorId)) {
      throw new Error("Invalid Doctor ID");
    }

    return PrescriptionModel.find({ doctorId }).exec();
  }

  /**
   * Update Prescription
   */
  static async updateById(
    id: string,
    payload: Partial<Record<string, unknown>>
  ) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid Prescription ID");
    }

    return PrescriptionModel.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    }).exec();
  }

  /**
   * Cancel Prescription
   */
  static async cancelById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid Prescription ID");
    }

    return PrescriptionModel.findByIdAndUpdate(
      id,
      { status: PrescriptionStatus.CANCELLED },
      { new: true }
    ).exec();
  }
}
