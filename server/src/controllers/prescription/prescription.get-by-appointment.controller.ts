import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import PrescriptionGetByAppointmentService from "../../services/prescription/prescription.get-by-appointment.service";

export default class PrescriptionGetByAppointmentController {
  static async get(req: Request, res: Response, next: NextFunction) {
    try {
      const appointmentId = new Types.ObjectId(req.params.appointmentId);
      const requesterId = new Types.ObjectId(req.user!.id);
      const role = req.user!.role as "DOCTOR" | "PATIENT";

      const prescription =
        await PrescriptionGetByAppointmentService.get({
          appointmentId,
          requesterId,
          role,
        });

      return res.status(200).json({
        success: true,
        data: prescription,
      });
    } catch (error) {
      next(error);
    }
  }
}
