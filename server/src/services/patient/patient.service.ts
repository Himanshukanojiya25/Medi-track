import { Types } from "mongoose";
import { PatientModel } from "../../models/patient";
import { PatientStatus } from "../../constants/status";

export default class PatientService {
  static async create(payload: Record<string, unknown>) {
    return PatientModel.create(payload);
  }

  static async getById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid Patient ID");
    }
    return PatientModel.findById(id).exec();
  }

  static async getAll() {
    return PatientModel.find().exec();
  }

  static async getByHospital(hospitalId: string) {
    if (!Types.ObjectId.isValid(hospitalId)) {
      throw new Error("Invalid Hospital ID");
    }
    return PatientModel.find({ hospitalId }).exec();
  }

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

  static async deactivateById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid Patient ID");
    }

    return PatientModel.findByIdAndUpdate(
      id,
      { status: PatientStatus.INACTIVE },
      { new: true }
    ).exec();
  }
}
