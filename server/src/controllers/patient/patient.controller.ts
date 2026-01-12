import { Request, Response, NextFunction } from "express";
import PatientService from "../../services/patient/patient.service";

/**
 * Patient Controller
 * ------------------
 * HTTP layer only.
 */
export default class PatientController {
  static async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const patient = await PatientService.create(req.body);
      res.status(201).json(patient);
    } catch (error) {
      next(error);
    }
  }

  static async getById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const patient = await PatientService.getById(id);
      res.status(200).json(patient);
    } catch (error) {
      next(error);
    }
  }

  static async getAll(
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const patients = await PatientService.getAll();
      res.status(200).json(patients);
    } catch (error) {
      next(error);
    }
  }

  static async getByHospital(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { hospitalId } = req.params;
      const patients = await PatientService.getByHospital(hospitalId);
      res.status(200).json(patients);
    } catch (error) {
      next(error);
    }
  }

  static async updateById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const patient = await PatientService.updateById(id, req.body);
      res.status(200).json(patient);
    } catch (error) {
      next(error);
    }
  }

  static async deactivateById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const patient = await PatientService.deactivateById(id);
      res.status(200).json(patient);
    } catch (error) {
      next(error);
    }
  }
}
