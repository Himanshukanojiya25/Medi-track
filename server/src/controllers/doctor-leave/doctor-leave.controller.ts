import { Request, Response, NextFunction } from "express";
import DoctorLeaveService from "../../services/doctor-leave/doctor-leave.service";

export default class DoctorLeaveController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;

      /**
       * =========================
       * HARD AUTH GUARD
       * =========================
       */
      if (
        !user ||
        !user.hospitalId ||
        !user.role
      ) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      /**
       * =========================
       * ROLE GUARD
       * =========================
       */
      if (
        user.role !== "super-admin" &&
        user.role !== "hospital-admin"
      ) {
        return res.status(403).json({
          success: false,
          message: "Only hospital admins can create doctor leave",
        });
      }

      /**
       * =========================
       * NORMALIZE DATA
       * =========================
       */
      const hospitalId = user.hospitalId;

      const createdBy =
        typeof (user as any)._id === "string"
          ? (user as any)._id
          : (user as any)._id?.toString?.() ??
            (user as any).id?.toString?.();

      if (!createdBy) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized: user id missing",
        });
      }

      const createdByRole =
        user.role === "super-admin"
          ? "super_admin"
          : "hospital_admin";

      /**
       * =========================
       * REQUEST BODY
       * =========================
       */
      const doctorId = req.body.doctorId as string | undefined;
      const startDate = req.body.startDate as string | undefined;
      const endDate = req.body.endDate as string | undefined;
      const reason = req.body.reason as string | undefined;

      if (!doctorId || !startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: "doctorId, startDate and endDate are required",
        });
      }

      /**
       * =========================
       * SERVICE CALL
       * =========================
       */
      const result = await DoctorLeaveService.createLeave({
        hospitalId,
        doctorId,
        startDate,
        endDate,
        reason,
        createdBy,
        createdByRole,
      });

      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
