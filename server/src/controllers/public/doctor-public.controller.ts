import { Request, Response } from "express";
import { PublicDoctorService } from "../../services/public";
import {
  doctorListQuerySchema,
  doctorIdParamSchema,
  doctorReviewsQuerySchema,
} from "../../validations/public";

export class PublicDoctorController {
  static async getList(req: Request, res: Response) {
    try {
      const query = doctorListQuerySchema.parse(req.query);
      const result = await PublicDoctorService.getList({
        speciality: query.speciality,
        city: query.city,
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
      const { id } = doctorIdParamSchema.parse(req.params);
      const doctor = await PublicDoctorService.getById(id);
      if (!doctor) {
        return res.status(404).json({ success: false, message: "Doctor not found" });
      }
      res.json({ success: true, data: doctor });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getReviews(req: Request, res: Response) {
    try {
      const { id } = doctorIdParamSchema.parse(req.params);
      const query = doctorReviewsQuerySchema.parse(req.query);
      const reviews = await PublicDoctorService.getReviews(id, query.page, query.limit);
      res.json({ success: true, data: reviews });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}