import { Request, Response, NextFunction } from "express";
import SuperAdminService from "../../services/super-admin/super-admin.service";

/**
 * Super Admin Controller
 * ----------------------
 * HTTP layer only.
 * Calls service layer.
 */
export default class SuperAdminController {
  static async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await SuperAdminService.create(req.body);
      res.status(201).json(result);
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
      const result = await SuperAdminService.getById(id);
      res.status(200).json(result);
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
      const result = await SuperAdminService.getAll();
      res.status(200).json(result);
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
      const result = await SuperAdminService.updateById(id, req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async deleteById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const result = await SuperAdminService.deleteById(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
