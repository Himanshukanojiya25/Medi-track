import { Request, Response, NextFunction } from "express";
import HospitalService from "../../services/hospital/hospital.service";

/**
 * Hospital Controller
 * -------------------
 * Handles HTTP layer only.
 */
export default class HospitalController {
  /**
   * Create Hospital
   */
  static async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await HospitalService.create(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get Hospital by ID
   */
  static async getById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const result = await HospitalService.getById(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all Hospitals
   */
  static async getAll(
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await HospitalService.getAll();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update Hospital by ID
   */
  static async updateById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const result = await HospitalService.updateById(id, req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Deactivate Hospital
   */
  static async deactivateById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const result = await HospitalService.deactivateById(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
