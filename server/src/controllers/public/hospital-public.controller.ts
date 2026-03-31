import { Request, Response } from "express";
import { PublicHospitalService } from "../../services/public";
import {
  hospitalListQuerySchema,
  hospitalIdParamSchema,
} from "../../validations/public";

export class PublicHospitalController {
  static async getList(req: Request, res: Response) {
    try {
      const query = hospitalListQuerySchema.parse(req.query);
      const result = await PublicHospitalService.getList({
        city: query.city,
        department: query.department,
        page: query.page,
        limit: query.limit,
      });
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = hospitalIdParamSchema.parse(req.params);
      const hospital = await PublicHospitalService.getById(id);
      if (!hospital) {
        return res.status(404).json({ success: false, message: "Hospital not found" });
      }
      res.json({ success: true, data: hospital });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getDoctors(req: Request, res: Response) {
    try {
      const { id } = hospitalIdParamSchema.parse(req.params);
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const doctors = await PublicHospitalService.getDoctors(id, page, limit);
      res.json({ success: true, data: doctors });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}