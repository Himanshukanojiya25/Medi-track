import { Request, Response, NextFunction } from "express";
import HospitalAdminService from "../../services/hospital-admin/hospital-admin.service";

/**
 * Hospital Admin Controller
 * -------------------------
 * Handles HTTP layer only.
 */
export default class HospitalAdminController {
  /**
   * Create Hospital Admin
   */
  static async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await HospitalAdminService.create(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get Hospital Admin by ID
   */
  static async getById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const result = await HospitalAdminService.getById(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all Hospital Admins
   */
  static async getAll(
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await HospitalAdminService.getAll();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update Hospital Admin by ID
   */
  static async updateById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const result = await HospitalAdminService.updateById(id, req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete Hospital Admin by ID
   */
  static async deleteById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const result = await HospitalAdminService.deleteById(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
