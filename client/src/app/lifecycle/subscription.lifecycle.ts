import type { SubscriptionPlan } from "../constants";

class SubscriptionLifecycle {
  private plan: SubscriptionPlan = "free";

  setPlan(plan: SubscriptionPlan) {
    this.plan = plan;
  }

  getPlan() {
    return this.plan;
  }
}

export const subscriptionLifecycle = new SubscriptionLifecycle();
