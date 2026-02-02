import { Types } from "mongoose";
import { PrescriptionModel } from "../../models/prescription";
import { AppointmentModel } from "../../models/appointment";
import { AppointmentStatus } from "../../constants/status";
import { HttpError } from "../../utils/response/http-error";

interface CreatePrescriptionInput {
  doctorId: Types.ObjectId;
  hospitalId: Types.ObjectId;
  appointmentId: Types.ObjectId;
  medicines: Array<{
    name: string;
    dosage: string;
    frequency: string;
    durationDays: number;
    instructions?: string;
  }>;
  notes?: string;
}

export default class PrescriptionCreateService {
  static async create(payload: CreatePrescriptionInput) {
    const {
      doctorId,
      hospitalId,
      appointmentId,
      medicines,
      notes,
    } = payload;

    /**
     * =========================
     * BASIC VALIDATION
     * =========================
     */
    if (!medicines || medicines.length === 0) {
      throw new HttpError(
        "Prescription must contain at least one medicine",
        400
      );
    }

    /**
     * =========================
     * FETCH APPOINTMENT
     * =========================
     */
    const appointment = await AppointmentModel.findById(appointmentId);

    if (!appointment) {
      throw new HttpError("Appointment not found", 404);
    }

    /**
     * =========================
     * OWNERSHIP CHECK
     * =========================
     */
    if (appointment.doctorId.toString() !== doctorId.toString()) {
      throw new HttpError(
        "You are not allowed to create prescription for this appointment",
        403
      );
    }

    if (appointment.hospitalId.toString() !== hospitalId.toString()) {
      throw new HttpError("Hospital mismatch", 403);
    }

    /**
     * =========================
     * STATUS CHECK
     * =========================
     */
    if (appointment.status !== AppointmentStatus.COMPLETED) {
      throw new HttpError(
        "Prescription can be created only after appointment is completed",
        409
      );
    }

    /**
     * =========================
     * ONE PRESCRIPTION PER APPOINTMENT
     * =========================
     */
    const existing = await PrescriptionModel.findOne({
      appointmentId,
      doctorId,
    });

    if (existing) {
      throw new HttpError(
        "Prescription already exists for this appointment",
        409
      );
    }

    /**
     * =========================
     * CREATE PRESCRIPTION
     * =========================
     */
    const prescription = await PrescriptionModel.create({
      hospitalId,
      patientId: appointment.patientId,
      doctorId,
      appointmentId,
      medicines,
      notes,
    });

    return prescription;
  }
}
