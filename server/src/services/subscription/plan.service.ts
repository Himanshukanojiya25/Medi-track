import { Types } from "mongoose";
import { HospitalModel } from "../../models/hospital";
import { SubscriptionPlan } from "../../constants/subscription/plans.constants";

interface HospitalPlanResponse {
  plan: SubscriptionPlan;
  activatedAt: Date;
}

export class PlanService {
  static async getHospitalPlan(
    hospitalId: Types.ObjectId
  ): Promise<HospitalPlanResponse> {
    const hospital = await HospitalModel.findById(hospitalId)
      .select({ plan: 1, planActivatedAt: 1 })
      .lean<{ plan: SubscriptionPlan; planActivatedAt: Date } | null>();

    if (!hospital) {
      throw new Error("Hospital not found");
    }

    return {
      plan: hospital.plan,
      activatedAt: hospital.planActivatedAt,
    };
  }

  static async updateHospitalPlan(
    hospitalId: Types.ObjectId,
    plan: SubscriptionPlan
  ): Promise<HospitalPlanResponse> {
    const hospital = await HospitalModel.findByIdAndUpdate(
      hospitalId,
      {
        plan,
        planActivatedAt: new Date(),
      },
      { new: true }
    )
      .select({ plan: 1, planActivatedAt: 1 })
      .lean<{ plan: SubscriptionPlan; planActivatedAt: Date } | null>();

    if (!hospital) {
      throw new Error("Hospital not found");
    }

    return {
      plan: hospital.plan,
      activatedAt: hospital.planActivatedAt,
    };
  }
}
