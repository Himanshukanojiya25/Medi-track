import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import AppointmentListForPatientService from "../../services/appointment/appointment.list-for-patient.service";

export default class AppointmentPatientListController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const patientId = new Types.ObjectId(req.user!.id); // auth middleware se
      const { type } = req.query; // UPCOMING | PAST | ALL

      const appointments = await AppointmentListForPatientService.list({
        patientId,
        type: type as "UPCOMING" | "PAST" | "ALL" | undefined,
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
