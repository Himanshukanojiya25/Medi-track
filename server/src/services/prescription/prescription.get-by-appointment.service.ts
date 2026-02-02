import { Types } from "mongoose";
import { PrescriptionModel } from "../../models/prescription";
import { HttpError } from "../../utils/response/http-error";

interface GetByAppointmentInput {
  appointmentId: Types.ObjectId;
  requesterId: Types.ObjectId;
  role: "DOCTOR" | "PATIENT";
}

export default class PrescriptionGetByAppointmentService {
  static async get(payload: GetByAppointmentInput) {
    const { appointmentId, requesterId, role } = payload;

    const prescription = await PrescriptionModel.findOne({
      appointmentId,
    }).lean();

    if (!prescription) {
      throw new HttpError("Prescription not found", 404);
    }

    /**
     * =========================
     * ACCESS CONTROL
     * =========================
     */
    if (
      role === "DOCTOR" &&
      prescription.doctorId.toString() !== requesterId.toString()
    ) {
      throw new HttpError("Access denied", 403);
    }

    if (
      role === "PATIENT" &&
      prescription.patientId.toString() !== requesterId.toString()
    ) {
      throw new HttpError("Access denied", 403);
    }

    return prescription;
  }
}
