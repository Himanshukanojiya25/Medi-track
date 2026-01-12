import { Request, Response, NextFunction } from "express";
import PrescriptionService from "../../services/prescription/prescription.service";

/**
 * Prescription Controller
 * -----------------------
 * HTTP layer only.
 * No business logic here.
 */
export default class PrescriptionController {
  /**
   * Create Prescription
   */
  static async create(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const prescription = await PrescriptionService.create(req.body);
      return res.status(201).json(prescription);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get Prescription by ID
   */
  static async getById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const prescription = await PrescriptionService.getById(id);
      return res.status(200).json(prescription);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get Prescriptions by Patient
   */
  static async getByPatient(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { patientId } = req.params;
      const prescriptions =
        await PrescriptionService.getByPatient(patientId);
      return res.status(200).json(prescriptions);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get Prescriptions by Doctor
   */
  static async getByDoctor(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { doctorId } = req.params;
      const prescriptions =
        await PrescriptionService.getByDoctor(doctorId);
      return res.status(200).json(prescriptions);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update Prescription
   */
  static async updateById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const prescription =
        await PrescriptionService.updateById(id, req.body);
      return res.status(200).json(prescription);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Cancel Prescription
   */
  static async cancelById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const prescription =
        await PrescriptionService.cancelById(id);
      return res.status(200).json(prescription);
    } catch (error) {
      next(error);
    }
  }
}
