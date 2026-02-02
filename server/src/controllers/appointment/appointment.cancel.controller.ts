import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import AppointmentCancelService from "../../services/appointment/appointment.cancel.service";

export default class AppointmentCancelController {
  static async cancel(req: Request, res: Response, next: NextFunction) {
    try {
      const appointmentId = new Types.ObjectId(req.params.id);
      const cancelledById = new Types.ObjectId(req.user!.id);
      const cancelledByRole = req.user!.role as "PATIENT" | "DOCTOR";

      const { reason } = req.body;

      const appointment = await AppointmentCancelService.cancel({
        appointmentId,
        cancelledById,
        cancelledByRole,
        reason,
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
