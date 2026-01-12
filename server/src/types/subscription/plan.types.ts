import { SubscriptionPlan } from "../../constants/subscription/plans.constants";

export interface HospitalPlanInfo {
  plan: SubscriptionPlan;
  activatedAt: Date;
}
