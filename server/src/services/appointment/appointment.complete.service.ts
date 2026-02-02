import { Types } from "mongoose";
import { AppointmentModel } from "../../models/appointment";
import { AppointmentStatus } from "../../constants/status";
import { HttpError } from "../../utils/response/http-error";
import { canTransitionStatus } from "./appointment-status-transition.util";

interface CompleteAppointmentInput {
  appointmentId: Types.ObjectId;
  doctorId: Types.ObjectId;
}

export default class AppointmentCompleteService {
  static async complete(payload: CompleteAppointmentInput) {
    const { appointmentId, doctorId } = payload;

    /**
     * =========================
     * FIND APPOINTMENT
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
        "You are not allowed to complete this appointment",
        403
      );
    }

    /**
     * =========================
     * STATUS TRANSITION CHECK
     * =========================
     */
    if (
      !canTransitionStatus(
        appointment.status,
        AppointmentStatus.COMPLETED
      )
    ) {
      throw new HttpError(
        `Cannot complete appointment with status ${appointment.status}`,
        409
      );
    }

    /**
     * =========================
     * COMPLETE APPOINTMENT
     * =========================
     */
    appointment.status = AppointmentStatus.COMPLETED;

    await appointment.save();

    return appointment;
  }
}
