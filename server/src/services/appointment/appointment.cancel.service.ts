import { Types } from "mongoose";
import { AppointmentModel } from "../../models/appointment";
import { AppointmentStatus } from "../../constants/status";
import { HttpError } from "../../utils/response/http-error";
import { canTransitionStatus } from "./appointment-status-transition.util";

export type CancelledByRole = "PATIENT" | "DOCTOR";

interface CancelAppointmentInput {
  appointmentId: Types.ObjectId;
  cancelledById: Types.ObjectId;
  cancelledByRole: CancelledByRole;
  reason: string;
}

export default class AppointmentCancelService {
  static async cancel(payload: CancelAppointmentInput) {
    const {
      appointmentId,
      cancelledById,
      cancelledByRole,
      reason,
    } = payload;

    if (!reason || !reason.trim()) {
      throw new HttpError("Cancel reason is required", 400);
    }

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
    if (
      cancelledByRole === "PATIENT" &&
      appointment.patientId.toString() !== cancelledById.toString()
    ) {
      throw new HttpError("You are not allowed to cancel this appointment", 403);
    }

    if (
      cancelledByRole === "DOCTOR" &&
      appointment.doctorId.toString() !== cancelledById.toString()
    ) {
      throw new HttpError("You are not allowed to cancel this appointment", 403);
    }

    /**
     * =========================
     * STATUS TRANSITION CHECK
     * =========================
     */
    if (
      !canTransitionStatus(
        appointment.status,
        AppointmentStatus.CANCELLED
      )
    ) {
      throw new HttpError(
        `Cannot cancel appointment with status ${appointment.status}`,
        409
      );
    }

    /**
     * =========================
     * PAST APPOINTMENT CHECK
     * =========================
     */
    if (appointment.scheduledAt.getTime() < Date.now()) {
      throw new HttpError("Past appointments cannot be cancelled", 409);
    }

    /**
     * =========================
     * CANCEL APPOINTMENT
     * =========================
     */
    appointment.status = AppointmentStatus.CANCELLED;
    appointment.cancelledAt = new Date();
    appointment.cancelledBy = cancelledById;
    appointment.cancelledReason = reason.trim();

    await appointment.save();

    return appointment;
  }
}
