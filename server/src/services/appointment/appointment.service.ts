import { Types } from "mongoose";
import { AppointmentModel } from "../../models/appointment";
import { CacheService } from "../../cache/cache.service";
import { CacheKeys } from "../../cache/cache.keys";
import { CacheTTL } from "../../cache/cache.ttl";
import NotificationService from "../notification/notification.service";
import AuditService from "../audit/audit.service";
import { AppointmentStatus } from "../../constants/status";
import { DoctorLeaveModel } from "../../models/doctor-leave";

/**
 * Appointment Service
 * -------------------
 * Pure business logic layer.
 * No Express, no req/res.
 */
export default class AppointmentService {

  /**
 * =========================
 * CHECK DOCTOR LEAVE
 * =========================
 */
private static async isDoctorOnLeave(
  doctorId: Types.ObjectId,
  date: Date
): Promise<boolean> {
  const leave = await DoctorLeaveModel.findOne({
    doctorId,
    startDate: { $lte: date },
    endDate: { $gte: date },
  }).lean();

  return !!leave;
}

  /**
   * Create Appointment
   */
static async create(payload: Record<string, unknown>) {
  try {
    const { doctorId, scheduledAt } = payload as {
  doctorId: string;
  scheduledAt: Date;
};

const isOnLeave = await this.isDoctorOnLeave(
  new Types.ObjectId(doctorId),
  new Date(scheduledAt)
);

if (isOnLeave) {
  throw {
    statusCode: 400,
    message: "Doctor is on leave for the selected date",
  };
}


    const appointment = new AppointmentModel(payload);
    const saved = await appointment.save();

    /**
     * =========================
     * AUDIT LOG — APPOINTMENT CREATED
     * =========================
     */
    await AuditService.log({
      hospitalId: saved.hospitalId.toString(),
      actorId: saved.patientId.toString(),
      actorRole: "patient",
      action: "APPOINTMENT_CREATED",
      metadata: {
        appointmentId: saved._id.toString(),
        doctorId: saved.doctorId.toString(),
      },
    });

    /**
     * =========================
     * NOTIFICATION — PATIENT
     * =========================
     */
    await NotificationService.create({
      hospitalId: saved.hospitalId.toString(),
      recipientId: saved.patientId.toString(),
      recipientRole: "patient",
      type: "appointment",
      title: "Appointment Scheduled",
      message: `Your appointment is scheduled on ${saved.scheduledAt.toDateString()}`,
      metadata: {
        appointmentId: saved._id.toString(),
        doctorId: saved.doctorId.toString(),
      },
    });

    /**
     * =========================
     * NOTIFICATION — DOCTOR
     * =========================
     */
    await NotificationService.create({
      hospitalId: saved.hospitalId.toString(),
      recipientId: saved.doctorId.toString(),
      recipientRole: "doctor",
      type: "appointment",
      title: "New Appointment Assigned",
      message: `You have a new appointment scheduled on ${saved.scheduledAt.toDateString()}`,
      metadata: {
        appointmentId: saved._id.toString(),
        patientId: saved.patientId.toString(),
      },
    });

    /**
     * =========================
     * CACHE INVALIDATION
     * =========================
     */
    await CacheService.invalidateByPattern("appointment:");

    return saved;
  } catch (error: any) {
    /**
     * =========================
     * DUPLICATE APPOINTMENT
     * =========================
     */
    if (error?.code === 11000) {
      throw {
        statusCode: 409,
        message: "Doctor already has an appointment at this time",
      };
    }

    throw error;
  }
}


  /**
   * Get Appointment by ID
   */
  static async getById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid Appointment ID");
    }

    return AppointmentModel.findById(id).exec();
  }

  /**
   * Get All Appointments (CACHED)
   */
  static async getAll() {
    const cacheKey = "appointment:all";

    const cached = await CacheService.get(cacheKey);
    if (cached) {
      return cached;
    }

    const appointments = await AppointmentModel.find().exec();

    await CacheService.set(
      cacheKey,
      appointments,
      CacheTTL.appointmentList
    );

    return appointments;
  }

  /**
   * Get Appointments by Hospital (CACHED)
   */
  static async getByHospital(hospitalId: string) {
    if (!Types.ObjectId.isValid(hospitalId)) {
      throw new Error("Invalid Hospital ID");
    }

    const cacheKey = `appointment:hospital=${hospitalId}`;

    const cached = await CacheService.get(cacheKey);
    if (cached) {
      return cached;
    }

    const appointments = await AppointmentModel.find({ hospitalId }).exec();

    await CacheService.set(
      cacheKey,
      appointments,
      CacheTTL.appointmentList
    );

    return appointments;
  }

  /**
   * Get Appointments by Doctor (CACHED)
   */
  static async getByDoctor(doctorId: string) {
    if (!Types.ObjectId.isValid(doctorId)) {
      throw new Error("Invalid Doctor ID");
    }

    const cacheKey = CacheKeys.appointment.byDoctorDate(
      doctorId,
      "all"
    );

    const cached = await CacheService.get(cacheKey);
    if (cached) {
      return cached;
    }

    const appointments = await AppointmentModel.find({ doctorId }).exec();

    await CacheService.set(
      cacheKey,
      appointments,
      CacheTTL.appointmentList
    );

    return appointments;
  }

  /**
   * Get Appointments by Patient (CACHED)
   */
  static async getByPatient(patientId: string) {
    if (!Types.ObjectId.isValid(patientId)) {
      throw new Error("Invalid Patient ID");
    }

    const cacheKey = `appointment:patient=${patientId}`;

    const cached = await CacheService.get(cacheKey);
    if (cached) {
      return cached;
    }

    const appointments = await AppointmentModel.find({ patientId }).exec();

    await CacheService.set(
      cacheKey,
      appointments,
      CacheTTL.appointmentList
    );

    return appointments;
  }

  /**
   * Get Appointments by Doctor & Date (CACHED)
   */
  static async getByDoctorAndDate(doctorId: string, date: string) {
    if (!Types.ObjectId.isValid(doctorId)) {
      throw new Error("Invalid Doctor ID");
    }

    const start = new Date(`${date}T00:00:00.000Z`);
    const end = new Date(`${date}T23:59:59.999Z`);

    const cacheKey = CacheKeys.appointment.byDoctorDate(
      doctorId,
      date
    );

    const cached = await CacheService.get(cacheKey);
    if (cached) {
      return cached;
    }

    const appointments = await AppointmentModel.find({
      doctorId,
      scheduledAt: { $gte: start, $lte: end },
    }).exec();

    await CacheService.set(
      cacheKey,
      appointments,
      CacheTTL.appointmentList
    );

    return appointments;
  }

  /**
   * Get Appointments by Doctor & Week (CACHED)
   */
  static async getByDoctorAndWeek(doctorId: string, weekStart: string) {
    if (!Types.ObjectId.isValid(doctorId)) {
      throw new Error("Invalid Doctor ID");
    }

    const start = new Date(`${weekStart}T00:00:00.000Z`);
    const end = new Date(start);

    end.setUTCDate(end.getUTCDate() + 6);
    end.setUTCHours(23, 59, 59, 999);

    const cacheKey = `appointment:doctor=${doctorId}:week=${weekStart}`;

    const cached = await CacheService.get(cacheKey);
    if (cached) {
      return cached;
    }

    const appointments = await AppointmentModel.find({
      doctorId,
      scheduledAt: { $gte: start, $lte: end },
    }).exec();

    await CacheService.set(
      cacheKey,
      appointments,
      CacheTTL.appointmentList
    );

    return appointments;
  }

  /**
   * Update Appointment by ID
   */
  static async updateById(
    id: string,
    payload: Partial<Record<string, unknown>>
  ) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid Appointment ID");
    }

    const updated = await AppointmentModel.findByIdAndUpdate(
      id,
      payload,
      {
        new: true,
        runValidators: true,
      }
    ).exec();

    await CacheService.invalidateByPattern("appointment:");

    return updated;
  }

  /**
   * Cancel Appointment by ID
   */
  static async cancelById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid Appointment ID");
    }

    const cancelled = await AppointmentModel.findByIdAndUpdate(
      id,
      { status: AppointmentStatus.CANCELLED },
      { new: true }
    ).exec();

    if (!cancelled) {
      return null;
    }

    await AuditService.log({
      hospitalId: cancelled.hospitalId.toString(),
      actorId: cancelled.patientId.toString(),
      actorRole: "patient",
      action: "APPOINTMENT_CANCELLED",
      metadata: {
        appointmentId: cancelled._id.toString(),
      },
    });

    await NotificationService.create({
      hospitalId: cancelled.hospitalId.toString(),
      recipientId: cancelled.patientId.toString(),
      recipientRole: "patient",
      type: "appointment",
      title: "Appointment Cancelled",
      message: `Your appointment scheduled on ${cancelled.scheduledAt.toDateString()} was cancelled`,
      metadata: {
        appointmentId: cancelled._id.toString(),
        doctorId: cancelled.doctorId.toString(),
      },
    });

    await NotificationService.create({
      hospitalId: cancelled.hospitalId.toString(),
      recipientId: cancelled.doctorId.toString(),
      recipientRole: "doctor",
      type: "appointment",
      title: "Appointment Cancelled",
      message: `An appointment scheduled on ${cancelled.scheduledAt.toDateString()} has been cancelled`,
      metadata: {
        appointmentId: cancelled._id.toString(),
        patientId: cancelled.patientId.toString(),
      },
    });

    await CacheService.invalidateByPattern("appointment:");

    return cancelled;
  }

  /**
   * =====================================================
   * Cancel Appointments by Doctor & Date Range (BULK)
   * =====================================================
   */
  static async cancelAppointmentsByDoctorAndRange(params: {
    doctorId: Types.ObjectId;
    startDate: Date;
    endDate: Date;
    reason: string;
    cancelledBy: Types.ObjectId;
    cancelledByRole: "doctor" | "hospital-admin" | "super-admin";
  }): Promise<number> {
    const {
      doctorId,
      startDate,
      endDate,
      reason,
      cancelledBy,
      cancelledByRole,
    } = params;

    const actorRole =
      cancelledByRole === "hospital-admin"
        ? "hospital_admin"
        : cancelledByRole === "super-admin"
        ? "super_admin"
        : "doctor";

    const appointments = await AppointmentModel.find({
      doctorId,
      scheduledAt: { $gte: startDate, $lte: endDate },
      status: AppointmentStatus.SCHEDULED,
    });

    for (const appointment of appointments) {
      appointment.status = AppointmentStatus.CANCELLED;
      appointment.cancelledReason = reason;
      appointment.cancelledAt = new Date();
      appointment.cancelledBy = cancelledBy;

      await appointment.save();

      await AuditService.log({
        hospitalId: appointment.hospitalId.toString(),
        actorId: cancelledBy.toString(),
        actorRole,
        action: "APPOINTMENT_CANCELLED",
        metadata: {
          appointmentId: appointment._id.toString(),
          doctorId: appointment.doctorId.toString(),
          reason,
        },
      });

      await NotificationService.create({
        hospitalId: appointment.hospitalId.toString(),
        recipientId: appointment.patientId.toString(),
        recipientRole: "patient",
        type: "appointment",
        title: "Appointment Cancelled",
        message: `Your appointment scheduled on ${appointment.scheduledAt.toDateString()} was cancelled.`,
        metadata: {
          appointmentId: appointment._id.toString(),
          doctorId: appointment.doctorId.toString(),
          reason,
        },
      });

      await NotificationService.create({
        hospitalId: appointment.hospitalId.toString(),
        recipientId: appointment.doctorId.toString(),
        recipientRole: "doctor",
        type: "appointment",
        title: "Appointment Cancelled",
        message: `An appointment scheduled on ${appointment.scheduledAt.toDateString()} has been cancelled.`,
        metadata: {
          appointmentId: appointment._id.toString(),
          patientId: appointment.patientId.toString(),
          reason,
        },
      });
    }

    await CacheService.invalidateByPattern("appointment:");

    return appointments.length;
  }

  /**
 * =====================================================
 * Reschedule Appointment
 * =====================================================
 */
static async rescheduleAppointment(params: {
  appointmentId: string;
  newScheduledAt: Date;
  rescheduledBy: Types.ObjectId;
  rescheduledByRole:
    | "super_admin"
    | "hospital_admin"
    | "doctor"
    | "patient"
    | "system";
}) {
  const {
    appointmentId,
    newScheduledAt,
    rescheduledBy,
    rescheduledByRole,
  } = params;

  if (!Types.ObjectId.isValid(appointmentId)) {
    throw new Error("Invalid Appointment ID");
  }

  const appointment = await AppointmentModel.findById(appointmentId);

  if (!appointment) {
    throw new Error("Appointment not found");
  }

  const isOnLeave = await this.isDoctorOnLeave(
  appointment.doctorId,
  newScheduledAt
);

if (isOnLeave) {
  throw {
    statusCode: 400,
    message: "Doctor is on leave for the selected date",
  };
}

  /**
   * =========================
   * LIFECYCLE RULES (STEP 1)
   * =========================
   */
  if (
    appointment.status === AppointmentStatus.CANCELLED ||
    appointment.status === AppointmentStatus.COMPLETED ||
    appointment.status === AppointmentStatus.NO_SHOW
  ) {
    throw {
      statusCode: 400,
      message: `Cannot reschedule appointment with status '${appointment.status}'`,
    };
  }

  /**
   * =========================
   * SLOT CONFLICT CHECK
   * =========================
   */
  const conflict = await AppointmentModel.findOne({
    _id: { $ne: appointment._id },
    doctorId: appointment.doctorId,
    scheduledAt: newScheduledAt,
    status: AppointmentStatus.SCHEDULED,
  });

  if (conflict) {
    throw {
      statusCode: 409,
      message: "Doctor already has an appointment at this time",
    };
  }

  const oldScheduledAt = appointment.scheduledAt;

  /**
   * =========================
   * UPDATE APPOINTMENT
   * =========================
   */
  appointment.scheduledAt = newScheduledAt;
  appointment.status = AppointmentStatus.SCHEDULED;

  // 🔥 CLEAR OLD CANCELLATION DATA
  appointment.cancelledReason = null;
  appointment.cancelledAt = null;
  appointment.cancelledBy = null;

  await appointment.save();

  

  /**
   * =========================
   * AUDIT LOG
   * =========================
   */
  await AuditService.log({
    hospitalId: appointment.hospitalId.toString(),
    actorId: rescheduledBy.toString(),
    actorRole: rescheduledByRole,
    action: "APPOINTMENT_RESCHEDULED",
    metadata: {
      appointmentId: appointment._id.toString(),
      oldScheduledAt,
      newScheduledAt,
    },
  });


  /**
   * =========================
   * NOTIFICATION — PATIENT
   * =========================
   */
  await NotificationService.create({
    hospitalId: appointment.hospitalId.toString(),
    recipientId: appointment.patientId.toString(),
    recipientRole: "patient",
    type: "appointment",
    title: "Appointment Rescheduled",
    message: `Your appointment has been rescheduled to ${newScheduledAt.toDateString()}`,
    metadata: {
      appointmentId: appointment._id.toString(),
      doctorId: appointment.doctorId.toString(),
      oldScheduledAt,
      newScheduledAt,
    },
  });

  /**
   * =========================
   * NOTIFICATION — DOCTOR
   * =========================
   */
 await NotificationService.create({
    hospitalId: appointment.hospitalId.toString(),
    recipientId: appointment.doctorId.toString(),
    recipientRole: "doctor",
    type: "appointment",
    title: "Appointment Rescheduled",
    message: `An appointment has been rescheduled to ${newScheduledAt.toDateString()}`,
    metadata: {
      appointmentId: appointment._id.toString(),
      patientId: appointment.patientId.toString(),
      oldScheduledAt,
      newScheduledAt,
    },
  });

  /**
   * =========================
   * CACHE INVALIDATION
   * =========================
   */
  await CacheService.invalidateByPattern("appointment:");

  return appointment;
}


}
