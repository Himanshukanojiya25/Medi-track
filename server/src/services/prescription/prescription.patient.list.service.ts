import { Types } from "mongoose";
import { PrescriptionModel } from "../../models/prescription";

export default class PrescriptionPatientListService {
  static async list(patientId: Types.ObjectId) {
    return PrescriptionModel.find({ patientId })
      .sort({ createdAt: -1 })
      .lean();
  }
}
