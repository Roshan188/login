import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { db } from "@/db";
import { subscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";
import type Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  const stripe = getStripe();
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const session = event.data.object as Stripe.Subscription | Stripe.Checkout.Session;

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const checkoutSession = session as Stripe.Checkout.Session;
        const userId = checkoutSession.metadata?.userId;
        if (!userId || !checkoutSession.subscription) break;

        const sub = await stripe.subscriptions.retrieve(
          checkoutSession.subscription as string,
        );

        await db
          .update(subscriptions)
          .set({
            stripeSubscriptionId: sub.id,
            stripePriceId: sub.items.data[0]?.price.id,
            plan: "pro",
            status: "active",
            currentPeriodStart: new Date(sub.current_period_start * 1000),
            currentPeriodEnd: new Date(sub.current_period_end * 1000),
            updatedAt: new Date(),
          })
          .where(eq(subscriptions.userId, userId));
        break;
      }

      case "customer.subscription.updated": {
        const sub = session as Stripe.Subscription;
        const userId = sub.metadata?.userId;
        if (!userId) break;

        const isActive = sub.status === "active" || sub.status === "trialing";
        await db
          .update(subscriptions)
          .set({
            plan: isActive ? "pro" : "free",
            status: sub.status as "active" | "canceled" | "past_due" | "trialing" | "inactive",
            currentPeriodStart: new Date(sub.current_period_start * 1000),
            currentPeriodEnd: new Date(sub.current_period_end * 1000),
            cancelAtPeriodEnd: sub.cancel_at_period_end,
            updatedAt: new Date(),
          })
          .where(eq(subscriptions.userId, userId));
        break;
      }

      case "customer.subscription.deleted": {
        const sub = session as Stripe.Subscription;
        const userId = sub.metadata?.userId;
        if (!userId) break;

        await db
          .update(subscriptions)
          .set({
            plan: "free",
            status: "canceled",
            stripeSubscriptionId: null,
            stripePriceId: null,
            updatedAt: new Date(),
          })
          .where(eq(subscriptions.userId, userId));
        break;
      }
    }
  } catch {
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
