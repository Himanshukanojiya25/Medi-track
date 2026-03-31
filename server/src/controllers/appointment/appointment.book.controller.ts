import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import AppointmentBookService from "../../services/appointment/appointment.book.service";

export default class AppointmentBookController {
  static async book(req: Request, res: Response, next: NextFunction) {
    try {
          // 1. User ID middleware se aata hai, hospital ID bhi middleware se aata hai
      const patientId = new Types.ObjectId(req.user!.id); // auth middleware se
      const hospitalId = new Types.ObjectId(req.user!.hospitalId);

    // 2. Request body se data leta hoon
      const {
        doctorId,
        scheduledAt,
        durationMinutes,
        reason,
      } = req.body;

          // 3. Service call karta hoon
      const appointment = await AppointmentBookService.book({
        patientId,
        hospitalId,
        doctorId: new Types.ObjectId(doctorId),
        scheduledAt: new Date(scheduledAt),
        durationMinutes,
        reason,
      });

          // 4. Success response
      return res.status(201).json({
        success: true,
        data: appointment,
      });
    } catch (error) {
      next(error);
    }
  }
}
