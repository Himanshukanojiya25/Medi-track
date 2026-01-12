import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import AppointmentService from "../../services/appointment/appointment.service";
import { toDbRole } from "../../utils/auth/role-mapper.util";

/**
 * Appointment Controller
 * ----------------------
 * Handles HTTP layer only.
 * - No business logic
 * - No DB logic
 */
export default class AppointmentController {
  /**
   * Create Appointment
   */
  static async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await AppointmentService.create(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get Appointment by ID
   */
  static async getById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const result = await AppointmentService.getById(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get All Appointments
   */
  static async getAll(
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await AppointmentService.getAll();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get Appointments by Hospital
   */
  static async getByHospital(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { hospitalId } = req.params;
      const result = await AppointmentService.getByHospital(hospitalId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get Appointments by Doctor
   */
  static async getByDoctor(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { doctorId } = req.params;
      const result = await AppointmentService.getByDoctor(doctorId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get Appointments by Patient
   */
  static async getByPatient(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { patientId } = req.params;
      const result = await AppointmentService.getByPatient(patientId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update Appointment by ID
   */
  static async updateById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const result = await AppointmentService.updateById(id, req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Cancel Appointment by ID
   */
  static async cancelById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const result = await AppointmentService.cancelById(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 🔥 Reschedule Appointment
   */
  static async reschedule(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { scheduledAt } = req.body;

      /**
       * Validation
       */
      if (!scheduledAt) {
        res.status(400).json({
          success: false,
          message: "scheduledAt is required",
        });
        return;
      }

      /**
       * Auth guard
       * req.user is injected by requireAuth middleware
       */
      if (!req.user) {
        throw new Error("Unauthorized");
      }

      /**
       * Service call
       * - req.user.role → AUTH role (SUPER_ADMIN, DOCTOR, etc.)
       * - toDbRole() → DB/AUDIT role (super_admin, doctor, etc.)
       */
      const result =
        await AppointmentService.rescheduleAppointment({
          appointmentId: id,
          newScheduledAt: new Date(scheduledAt),
          rescheduledBy: new Types.ObjectId(req.user.id),
          rescheduledByRole: toDbRole(req.user.role),
        });

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
