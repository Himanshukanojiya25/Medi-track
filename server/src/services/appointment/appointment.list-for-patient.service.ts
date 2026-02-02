import { Types } from "mongoose";
import { AppointmentModel } from "../../models/appointment";
import { AppointmentStatus } from "../../constants/status";
import { HttpError } from "../../utils/response/http-error";

type ListType = "UPCOMING" | "PAST" | "ALL";

interface ListAppointmentsForPatientInput {
  patientId: Types.ObjectId;
  type?: ListType; // UPCOMING | PAST | ALL
}

export default class AppointmentListForPatientService {
  static async list(payload: ListAppointmentsForPatientInput) {
    const { patientId, type = "ALL" } = payload;

    if (!patientId) {
      throw new HttpError("Patient ID is required", 400);
    }

    const now = new Date();

    const baseQuery: Record<string, unknown> = {
      patientId,
    };

    /**
     * =========================
     * FILTER LOGIC
     * =========================
     */
    if (type === "UPCOMING") {
      baseQuery.scheduledAt = { $gte: now };
      baseQuery.status = AppointmentStatus.SCHEDULED;
    }

    if (type === "PAST") {
      baseQuery.$or = [
        { scheduledAt: { $lt: now } },
        { status: AppointmentStatus.CANCELLED },
      ];
    }

    /**
     * =========================
     * FETCH APPOINTMENTS
     * =========================
     */
    const appointments = await AppointmentModel.find(baseQuery)
      .sort({ scheduledAt: 1 }) // nearest first
      .populate("doctorId", "name specialization")
      .lean();

    return appointments;
  }
}
