import { SUBSCRIPTION_PLANS } from "../constants/subscription.constants";

/**
 * Derived SubscriptionPlan type
 */
export type SubscriptionPlan =
  (typeof SUBSCRIPTION_PLANS)[keyof typeof SUBSCRIPTION_PLANS];

/**
 * Subscription Guard
 * -----------------------
 * Controls access based on user's plan.
 */
export function subscriptionGuard(
  userPlan: SubscriptionPlan | null | undefined,
  allowedPlans: readonly SubscriptionPlan[]
): boolean {
  if (!userPlan) return false;
  return allowedPlans.includes(userPlan);
}
