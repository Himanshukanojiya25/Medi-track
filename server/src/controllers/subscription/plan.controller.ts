import { Request, Response } from "express";
import { Types } from "mongoose";
import { PlanService } from "../../services/subscription/plan.service";

export class PlanController {
  static async getPlan(req: Request, res: Response) {
    const hospitalId = req.user?.hospitalId;

    if (!hospitalId) {
      return res.status(401).json({
        success: false,
        message: "Hospital context missing",
      });
    }

    const planInfo = await PlanService.getHospitalPlan(
      new Types.ObjectId(hospitalId)
    );

    res.status(200).json({
      success: true,
      data: planInfo,
    });
  }

  static async updatePlan(req: Request, res: Response) {
    const hospitalId = req.user?.hospitalId;
    const { plan } = req.body;

    if (!hospitalId) {
      return res.status(401).json({
        success: false,
        message: "Hospital context missing",
      });
    }

    const updated = await PlanService.updateHospitalPlan(
      new Types.ObjectId(hospitalId),
      plan
    );

    res.status(200).json({
      success: true,
      data: updated,
    });
  }
}
