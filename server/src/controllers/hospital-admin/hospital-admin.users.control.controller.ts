import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import HospitalAdminUsersControlService from
  "../../services/hospital-admin/hospital-admin.users.control.service";

export default class HospitalAdminUsersControlController {
  /**
   * Activate / Deactivate Doctor
   */
  static async updateDoctor(req: Request, res: Response, next: NextFunction) {
    try {
      const hospitalId = new Types.ObjectId(req.user!.hospitalId);
      const doctorId = new Types.ObjectId(req.params.id);
      const { isActive } = req.body;

      const doctor =
        await HospitalAdminUsersControlService.updateDoctorStatus({
          hospitalId,
          doctorId,
          isActive: Boolean(isActive),
        });

      res.status(200).json({
        success: true,
        data: doctor,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Block / Unblock Patient
   */
  static async updatePatient(req: Request, res: Response, next: NextFunction) {
    try {
      const hospitalId = new Types.ObjectId(req.user!.hospitalId);
      const patientId = new Types.ObjectId(req.params.id);
      const { isBlocked } = req.body;

      const patient =
        await HospitalAdminUsersControlService.updatePatientStatus({
          hospitalId,
          patientId,
          isBlocked: Boolean(isBlocked),
        });

      res.status(200).json({
        success: true,
        data: patient,
      });
    } catch (error) {
      next(error);
    }
  }
}
