/**
 * Subscription plan definitions
 * Pricing in minor units (no floating point)
 */
export const SUBSCRIPTION_PLANS = {
  FREE: {
    key: "FREE",
    name: "Free",
    priceCents: 0,
    currency: "INR",
    active: true,
  },

  BASIC: {
    key: "BASIC",
    name: "Basic",
    priceCents: 99900, // ₹999.00
    currency: "INR",
    active: true,
  },

  PRO: {
    key: "PRO",
    name: "Pro",
    priceCents: 249900, // ₹2499.00
    currency: "INR",
    active: true,
  },

  ENTERPRISE: {
    key: "ENTERPRISE",
    name: "Enterprise",
    priceCents: 0, // custom pricing
    currency: "INR",
    active: true,
  },
} as const;
