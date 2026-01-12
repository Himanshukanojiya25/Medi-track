import { z } from "zod";
import { SUBSCRIPTION_PLANS } from "../../constants/subscription/plans.constants";

export const updatePlanSchema = z.object({
  body: z.object({
    plan: z.enum([
      SUBSCRIPTION_PLANS.FREE,
      SUBSCRIPTION_PLANS.PRO,
      SUBSCRIPTION_PLANS.ENTERPRISE,
    ]),
  }),
});
