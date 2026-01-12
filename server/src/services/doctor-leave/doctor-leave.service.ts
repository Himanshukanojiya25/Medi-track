import { Types } from "mongoose";
import { DoctorLeaveModel } from "../../models/doctor-leave";
import AppointmentService from "../appointment/appointment.service";

export default class DoctorLeaveService {
  /**
   * Create doctor leave + auto-cancel affected appointments
   */
  static async createLeave(payload: {
    hospitalId: string;
    doctorId: string;
    startDate: string;
    endDate: string;
    reason?: string;
    createdBy: string; // hospital-admin / super-admin
    createdByRole: "hospital_admin" | "super_admin";
  }) {
    const {
      hospitalId,
      doctorId,
      startDate,
      endDate,
      reason,
      createdBy,
      createdByRole,
    } = payload;

    if (
      !Types.ObjectId.isValid(hospitalId) ||
      !Types.ObjectId.isValid(doctorId) ||
      !Types.ObjectId.isValid(createdBy)
    ) {
      throw new Error("Invalid ID");
    }

    /**
     * =========================
     * ROLE NORMALIZATION
     * (snake_case → kebab-case)
     * =========================
     */
    const cancelledByRole =
      createdByRole === "super_admin"
        ? "super-admin"
        : "hospital-admin";

    /**
     * =========================
     * CREATE DOCTOR LEAVE
     * =========================
     */
    const leave = await DoctorLeaveModel.create({
      hospitalId,
      doctorId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      reason,
    });

    /**
     * =========================
     * CANCEL AFFECTED APPOINTMENTS
     * (single source of truth)
     * =========================
     */
    const cancelledCount =
      await AppointmentService.cancelAppointmentsByDoctorAndRange({
        doctorId: new Types.ObjectId(doctorId),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        reason:
          reason || "Doctor unavailable due to approved leave",
        cancelledBy: new Types.ObjectId(createdBy),
        cancelledByRole,
      });

    return {
      leave,
      cancelledAppointments: cancelledCount,
    };
  }
}
