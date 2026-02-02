import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import PrescriptionCreateService from "../../services/prescription/prescription.create.service";
import { PrescriptionCreateSchema } from "../../validations/prescription/prescription.create.validation";

/**
 * Prescription Create Controller
 * ------------------------------
 * HTTP layer only
 * - validates input
 * - extracts auth context
 * - delegates to service
 */
export default class PrescriptionCreateController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      /**
       * =========================
       * AUTH CONTEXT
       * =========================
       */
      const doctorId = new Types.ObjectId(req.user!.id);
      const hospitalId = new Types.ObjectId(req.user!.hospitalId);

      /**
       * =========================
       * VALIDATION (ZOD)
       * =========================
       */
      const parsed = PrescriptionCreateSchema.parse(req.body);

      /**
       * =========================
       * SERVICE CALL
       * =========================
       */
      const prescription = await PrescriptionCreateService.create({
        doctorId,
        hospitalId,
        appointmentId: new Types.ObjectId(parsed.appointmentId),
        medicines: parsed.medicines,
        notes: parsed.notes,
      });

      /**
       * =========================
       * RESPONSE
       * =========================
       */
      return res.status(201).json({
        success: true,
        data: prescription,
      });
    } catch (error) {
      next(error);
    }
  }
}
