import { Types } from "mongoose";
import { HospitalModel } from "../../models/hospital";
import { HOSPITAL_STATUS } from "../../constants/status";

export default class HospitalService {
  /**
   * Create hospital
   */
  static async create(payload: Record<string, unknown>) {
    return HospitalModel.create(payload);
  }

  /**
   * Get hospital by ID
   */
  static async getById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid Hospital ID");
    }
    return HospitalModel.findById(id);
  }

  /**
   * ✅ Get all hospitals
   * (Used by controller)
   */
  static async getAll() {
    return HospitalModel.find();
  }

  /**
   * Update hospital by ID
   */
  static async updateById(id: string, payload: { name?: string }) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid Hospital ID");
    }

    const hospital = await HospitalModel.findById(id);
    if (!hospital) return null;

    if (payload.name !== undefined) {
      hospital.name = payload.name;
    }

    await hospital.save();
    return hospital;
  }

  /**
   * Deactivate hospital
   */
  static async deactivateById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid Hospital ID");
    }

    const hospital = await HospitalModel.findById(id);
    if (!hospital) return null;

    hospital.status = HOSPITAL_STATUS.INACTIVE;
    hospital.isActive = false;

    await hospital.save();
    return hospital;
  }
}
