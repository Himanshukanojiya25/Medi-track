import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import DoctorAppointmentsService from "../../services/doctor/doctor.appointments.service";
import { AppointmentStatus } from "../../constants/status";
import { DoctorAppointmentsQuerySchema } from "../../validations/doctor/doctor.appointments.validation";

export default class DoctorAppointmentsController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const doctorId = new Types.ObjectId(req.user!.id);

      const parsed = DoctorAppointmentsQuerySchema.parse(req.query);

      const appointments = await DoctorAppointmentsService.list({
        doctorId,
        date: parsed.date,
        status: parsed.status as AppointmentStatus | undefined,
        from: parsed.from ? new Date(parsed.from) : undefined,
        to: parsed.to ? new Date(parsed.to) : undefined,
      });

      return res.status(200).json({
        success: true,
        data: appointments,
      });
    } catch (error) {
      next(error);
    }
  }
}
