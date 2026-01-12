import { Request, Response, NextFunction } from "express";
import BillingService from "../../services/billing/billing.service";

/**
 * Billing Controller
 * ------------------
 * Handles HTTP layer only.
 */
export default class BillingController {
  /**
   * Create Billing
   */
  static async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await BillingService.create(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get Billing by ID
   */
  static async getById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const result = await BillingService.getById(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get All Billings
   */
  static async getAll(
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await BillingService.getAll();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get Billings by Hospital
   */
  static async getByHospital(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { hospitalId } = req.params;
      const result = await BillingService.getByHospital(hospitalId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get Billings by Appointment
   */
  static async getByAppointment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { appointmentId } = req.params;
      const result = await BillingService.getByAppointment(appointmentId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update Billing
   */
  static async updateById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const result = await BillingService.updateById(id, req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Mark Billing as Paid
   */
  static async markPaidById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const result = await BillingService.markPaidById(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Cancel Billing
   */
  static async cancelById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const result = await BillingService.cancelById(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
