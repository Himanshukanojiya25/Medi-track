import { Types } from "mongoose";
import { AppointmentModel } from "../../models/appointment";
import { DoctorModel } from "../../models/doctor";
import { DoctorAvailabilityModel } from "../../models/doctor-availability";
import { AppointmentStatus } from "../../constants/status";
import { HttpError } from "../../utils/response/http-error";

interface BookAppointmentInput {
  patientId: Types.ObjectId;
  doctorId: Types.ObjectId;
  hospitalId: Types.ObjectId;
  scheduledAt: Date;
  durationMinutes: number;
  reason?: string;
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export default class AppointmentBookService {
  static async book(payload: BookAppointmentInput) {
    const {
      patientId,
      doctorId,
      hospitalId,
      scheduledAt,
      durationMinutes,
      reason,
    } = payload;

    /**
     * =========================
     * BASIC VALIDATIONS
     * =========================
     */
    if (durationMinutes < 5 || durationMinutes > 480) {
      throw new HttpError("Invalid appointment duration", 400);
    }

    if (scheduledAt.getTime() < Date.now()) {
      throw new HttpError("Cannot book appointment in the past", 400);
    }

    /**
     * =========================
     * DOCTOR VALIDATION
     * =========================
     */
    const doctor = await DoctorModel.findById(doctorId).lean();

    if (!doctor) {
      throw new HttpError("Doctor not found", 404);
    }

    if (doctor.hospitalId.toString() !== hospitalId.toString()) {
      throw new HttpError("Doctor does not belong to this hospital", 403);
    }

    /**
     * =========================
     * AVAILABILITY CHECK (WEEKLY SLOTS)
     * =========================
     */
    const availability = await DoctorAvailabilityModel.findOne({
      doctorId,
      isActive: true,
    }).lean();

    if (!availability) {
      throw new HttpError("Doctor is not available", 409);
    }

    const dayOfWeek = scheduledAt.getDay(); // 0–6
    const dailyAvailability = availability.weeklyAvailability.find(
      (d) => d.dayOfWeek === dayOfWeek
    );

    if (!dailyAvailability || dailyAvailability.slots.length === 0) {
      throw new HttpError("Doctor is not available on this day", 409);
    }

    const appointmentStartMinutes =
      scheduledAt.getHours() * 60 + scheduledAt.getMinutes();
    const appointmentEndMinutes =
      appointmentStartMinutes + durationMinutes;

    const isWithinAnySlot = dailyAvailability.slots.some((slot) => {
      const slotStart = timeToMinutes(slot.start);
      const slotEnd = timeToMinutes(slot.end);

      return (
        appointmentStartMinutes >= slotStart &&
        appointmentEndMinutes <= slotEnd
      );
    });

    if (!isWithinAnySlot) {
      throw new HttpError("Requested slot is outside doctor availability", 409);
    }

    /**
     * =========================
     * SLOT OVERLAP PROTECTION
     * =========================
     */
    const appointmentEnd = new Date(
      scheduledAt.getTime() + durationMinutes * 60 * 1000
    );

    const overlappingAppointment = await AppointmentModel.findOne({
      doctorId,
      status: AppointmentStatus.SCHEDULED,
      scheduledAt: { $lt: appointmentEnd },
      $expr: {
        $gt: [
          {
            $add: [
              "$scheduledAt",
              { $multiply: ["$durationMinutes", 60000] },
            ],
          },
          scheduledAt,
        ],
      },
    }).lean();

    if (overlappingAppointment) {
      throw new HttpError("Appointment slot already booked", 409);
    }

    /**
     * =========================
     * CREATE APPOINTMENT
     * =========================
     */
    try {
      return await AppointmentModel.create({
        hospitalId,
        patientId,
        doctorId,
        scheduledAt,
        durationMinutes,
        reason,
        status: AppointmentStatus.SCHEDULED,
      });
    } catch (error) {
      throw new HttpError("Failed to create appointment", 500);
    }
  }
}
