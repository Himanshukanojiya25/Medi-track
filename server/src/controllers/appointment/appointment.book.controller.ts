import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import AppointmentBookService from "../../services/appointment/appointment.book.service";

export default class AppointmentBookController {
  static async book(req: Request, res: Response, next: NextFunction) {
    try {
      const patientId = new Types.ObjectId(req.user!.id); // auth middleware se
      const hospitalId = new Types.ObjectId(req.user!.hospitalId);

      const {
        doctorId,
        scheduledAt,
        durationMinutes,
        reason,
      } = req.body;

      const appointment = await AppointmentBookService.book({
        patientId,
        hospitalId,
        doctorId: new Types.ObjectId(doctorId),
        scheduledAt: new Date(scheduledAt),
        durationMinutes,
        reason,
      });

      return res.status(201).json({
        success: true,
        data: appointment,
      });
    } catch (error) {
      next(error);
    }
  }
}
