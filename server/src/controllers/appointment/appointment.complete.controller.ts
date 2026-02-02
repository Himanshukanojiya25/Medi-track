import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import AppointmentCompleteService from "../../services/appointment/appointment.complete.service";

export default class AppointmentCompleteController {
  static async complete(req: Request, res: Response, next: NextFunction) {
    try {
      const appointmentId = new Types.ObjectId(req.params.id);
      const doctorId = new Types.ObjectId(req.user!.id);

      const appointment = await AppointmentCompleteService.complete({
        appointmentId,
        doctorId,
      });

      return res.status(200).json({
        success: true,
        data: appointment,
      });
    } catch (error) {
      next(error);
    }
  }
}
