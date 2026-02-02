import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import PrescriptionPatientListService from "../../services/prescription/prescription.patient.list.service";

export default class PrescriptionPatientListController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const patientId = new Types.ObjectId(req.user!.id);

      const prescriptions =
        await PrescriptionPatientListService.list(patientId);

      return res.status(200).json({
        success: true,
        data: prescriptions,
      });
    } catch (error) {
      next(error);
    }
  }
}
