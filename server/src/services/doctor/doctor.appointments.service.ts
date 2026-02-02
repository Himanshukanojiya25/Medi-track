import { Types } from "mongoose";
import { AppointmentModel } from "../../models/appointment";
import { AppointmentStatus } from "../../constants/status";

type DateFilter = "today" | "upcoming" | "past";

interface DoctorAppointmentsInput {
  doctorId: Types.ObjectId;
  date?: DateFilter;
  status?: AppointmentStatus;
  from?: Date;
  to?: Date;
}

export default class DoctorAppointmentsService {
  static async list(payload: DoctorAppointmentsInput) {
    const { doctorId, date, status, from, to } = payload;

    const query: any = {
      doctorId,
    };

    const now = new Date();

    /**
     * =========================
     * DATE FILTERS
     * =========================
     */
    if (date === "today") {
      const start = new Date();
      start.setHours(0, 0, 0, 0);

      const end = new Date();
      end.setHours(23, 59, 59, 999);

      query.scheduledAt = { $gte: start, $lte: end };
    }

    if (date === "upcoming") {
      query.scheduledAt = { $gt: now };
    }

    if (date === "past") {
      query.scheduledAt = { $lt: now };
    }

    /**
     * =========================
     * RANGE FILTER (OPTIONAL)
     * =========================
     */
    if (from || to) {
      query.scheduledAt = {
        ...(query.scheduledAt || {}),
        ...(from ? { $gte: from } : {}),
        ...(to ? { $lte: to } : {}),
      };
    }

    /**
     * =========================
     * STATUS FILTER
     * =========================
     */
    if (status) {
      query.status = status;
    }

    /**
     * =========================
     * FETCH APPOINTMENTS
     * =========================
     */
    return AppointmentModel.find(query)
  .sort({ scheduledAt: -1 })
  .lean();
  
  }
}
