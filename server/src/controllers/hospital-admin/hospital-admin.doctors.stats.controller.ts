import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import HospitalAdminDoctorsStatsService from
  "../../services/hospital-admin/hospital-admin.doctors.stats.service";

export default class HospitalAdminDoctorsStatsController {
  static async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const hospitalId = new Types.ObjectId(req.user!.hospitalId);

      const data =
        await HospitalAdminDoctorsStatsService.getStats({
          hospitalId,
        });

      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}
