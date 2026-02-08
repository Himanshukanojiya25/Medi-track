import type { ID, ISODateString } from "../shared";

/**
 * Subscription plan tier
 */
export enum SubscriptionTier {
  FREE = "FREE",
  BASIC = "BASIC",
  PRO = "PRO",
  ENTERPRISE = "ENTERPRISE",
}

/**
 * Subscription billing interval
 */
export enum BillingInterval {
  MONTHLY = "MONTHLY",
  YEARLY = "YEARLY",
}

/**
 * Subscription plan definition
 */
export interface SubscriptionPlan {
  readonly id: ID;

  readonly name: string;
  readonly tier: SubscriptionTier;

  readonly priceCents: number; // minor units
  readonly currency: string;   // ISO 4217

  readonly billingInterval: BillingInterval;
  readonly isActive: boolean;
}
