import { Request, Response, NextFunction } from "express";
import DoctorService from "../../services/doctor/doctor.service";

/**
 * Doctor Controller
 * -----------------
 * Handles HTTP layer only.
 * ❌ No business logic
 * ❌ No RBAC (middleware handles it)
 */
export default class DoctorController {
  /**
   * ============================
   * CREATE DOCTOR (Hospital Admin)
   * ============================
   */
  static async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: "Unauthorized",
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
   * ============================
   * 🔥 OPTION A: LIST DOCTORS (PATIENT / PUBLIC)
   * ============================
   */
  static async listForPatients(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { departmentId, hospitalId } = req.query;

      const doctors = await DoctorService.getDoctorsForPatients({
        departmentId: departmentId as string | undefined,
        hospitalId: hospitalId as string | undefined,
      });

      res.status(200).json({
        success: true,
        data: doctors,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * ============================
   * GET DOCTOR BY ID
   * ============================
   */
  static async getById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const result = await DoctorService.getById(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * ============================
   * GET ALL DOCTORS (ADMIN)
   * ============================
   */
  static async getAll(
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await DoctorService.getAll();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * ============================
   * UPDATE DOCTOR
   * ============================
   */
  static async updateById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const result = await DoctorService.updateById(id, req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * ============================
   * DELETE DOCTOR
   * ============================
   */
  static async deleteById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const result = await DoctorService.deleteById(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
