import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import HospitalAdminAppointmentsService from "../../services/hospital-admin/hospital-admin.appointments.service";

export default class HospitalAdminAppointmentsController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const hospitalId = new Types.ObjectId(req.user!.hospitalId);

      const {
        page,
        limit,
        status,
        doctorId,
        from,
        to,
      } = req.query;

      const result =
        await HospitalAdminAppointmentsService.list({
          hospitalId,
          page: page ? Number(page) : undefined,
          limit: limit ? Number(limit) : undefined,
          status: status as any,
          doctorId: doctorId
            ? new Types.ObjectId(doctorId as string)
            : undefined,
          from: from ? new Date(from as string) : undefined,
          to: to ? new Date(to as string) : undefined,
        });

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
