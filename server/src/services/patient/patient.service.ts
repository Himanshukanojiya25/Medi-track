import { Types } from "mongoose";
import { PatientModel } from "../../models/patient";

/**
 * Patient Service
 * ----------------
 * Pure business logic layer.
 */
export default class PatientService {
  /**
   * Create Patient
   */
  static async create(payload: Record<string, unknown>) {
    const patient = new PatientModel(payload);
    return patient.save();
  }

  /**
   * Get Patient by ID
   */
  static async getById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid Patient ID");
    }

    return PatientModel.findById(id).exec();
  }

  /**
   * Get All Patients
   */
  static async getAll() {
    return PatientModel.find().exec();
  }

  /**
   * Get Patients by Hospital
   */
  static async getByHospital(hospitalId: string) {
    if (!Types.ObjectId.isValid(hospitalId)) {
      throw new Error("Invalid Hospital ID");
    }

    return PatientModel.find({ hospitalId }).exec();
  }

  /**
   * Update Patient by ID
   */
  static async updateById(
    id: string,
    payload: Partial<Record<string, unknown>>
  ) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid Patient ID");
    }

    return PatientModel.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    }).exec();
  }

  /**
   * Deactivate Patient by ID
   */
  static async deactivateById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid Patient ID");
    }

    return PatientModel.findByIdAndUpdate(
      id,
      { status: "INACTIVE" },
      { new: true }
    ).exec();
  }
}
