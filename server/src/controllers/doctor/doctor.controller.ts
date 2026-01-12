import { Request, Response, NextFunction } from "express";
import DoctorService from "../../services/doctor/doctor.service";

/**
 * Doctor Controller
 * -----------------
 * Handles HTTP layer only.
 */
export default class DoctorController {
  /**
   * Create Doctor
   */
static async create(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // 🔐 Auth guard
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    // 🔥 ONLY hospital-admin can create doctor
    if (req.user.role !== "hospital-admin") {
      res.status(403).json({
        success: false,
        message: "Only hospital admin can create doctors",
      });
      return;
    }

    const result = await DoctorService.create({
      ...req.body,
      hospitalId: req.user.hospitalId,
      hospitalAdminId: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Doctor created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}


  /**
   * Get Doctor by ID
   */
  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await DoctorService.getById(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all Doctors
   */
  static async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const result = await DoctorService.getAll();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update Doctor by ID
   */
  static async updateById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await DoctorService.updateById(id, req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete Doctor by ID
   */
  static async deleteById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await DoctorService.deleteById(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
