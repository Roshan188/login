import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-02-24.acacia",
      typescript: true,
    });
  }
  return _stripe;
}

export const PLANS = {
  free: {
    name: "Free",
    price: 0,
    priceId: null,
    features: {
      portfolios: 1,
      projects: 5,
      customDomain: false,
      analytics: "basic",
      branding: true,
    },
  },
  pro: {
    name: "Pro",
    price: 12,
    priceId: process.env.STRIPE_PRICE_PRO_MONTHLY,
    features: {
      portfolios: -1,
      projects: -1,
      customDomain: true,
      analytics: "advanced",
      branding: false,
    },
  },
} as const;

export type PlanId = keyof typeof PLANS;

export function getPlanById(priceId: string | null): PlanId {
  if (!priceId) return "free";
  if (priceId === PLANS.pro.priceId) return "pro";
  return "free";
}
