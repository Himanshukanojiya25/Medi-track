import { Types } from "mongoose";
import { HospitalModel } from "../../models/hospital";
import { SUBSCRIPTION_PLANS } from "../../constants/subscription/plans.constants";

/**
 * All features supported by the system
 * (single source of truth)
 */
export enum FEATURES {
  AI_CHAT = "AI_CHAT",
  ADVANCED_ANALYTICS = "ADVANCED_ANALYTICS",
  PRIORITY_SUPPORT = "PRIORITY_SUPPORT",
}

/**
 * Feature availability per plan
 */
const PLAN_FEATURE_MAP: Record<
  (typeof SUBSCRIPTION_PLANS)[keyof typeof SUBSCRIPTION_PLANS],
  readonly FEATURES[]
> = {
  [SUBSCRIPTION_PLANS.FREE]: [FEATURES.AI_CHAT],

  [SUBSCRIPTION_PLANS.PRO]: [
    FEATURES.AI_CHAT,
    FEATURES.ADVANCED_ANALYTICS,
  ],

  [SUBSCRIPTION_PLANS.ENTERPRISE]: [
    FEATURES.AI_CHAT,
    FEATURES.ADVANCED_ANALYTICS,
    FEATURES.PRIORITY_SUPPORT,
  ],
};

export class FeatureAccessService {
  /**
   * Check if a hospital can access a given feature
   */
  static async hasAccess(
    hospitalId: Types.ObjectId,
    feature: FEATURES
  ): Promise<boolean> {
    const hospital = await HospitalModel.findById(hospitalId)
      .select({ plan: 1 })
      .lean<{ plan: keyof typeof SUBSCRIPTION_PLANS } | null>();

    if (!hospital) {
      throw new Error("Hospital not found");
    }

    const allowedFeatures = PLAN_FEATURE_MAP[hospital.plan];

    return allowedFeatures.includes(feature);
  }

  /**
   * Assert access (throws error if not allowed)
   * Useful for middleware
   */
  static async assertAccess(
    hospitalId: Types.ObjectId,
    feature: FEATURES
  ): Promise<void> {
    const allowed = await this.hasAccess(hospitalId, feature);

    if (!allowed) {
      throw new Error(`Feature ${feature} is not allowed for this plan`);
    }
  }
}
