import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getStripe, PLANS } from "@/lib/stripe";
import { db } from "@/db";
import { subscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { absoluteUrl } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan } = await req.json();
    if (plan !== "pro") {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const priceId = PLANS.pro.priceId;
    if (!priceId) {
      return NextResponse.json({ error: "Plan not configured" }, { status: 500 });
    }

    const stripe = getStripe();

    // Get or create subscription record
    const sub = await db.query.subscriptions.findFirst({
      where: eq(subscriptions.userId, session.user.id),
    });

    let customerId = sub?.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: session.user.email,
        name: session.user.name ?? undefined,
        metadata: { userId: session.user.id },
      });
      customerId = customer.id;

      if (sub) {
        await db
          .update(subscriptions)
          .set({ stripeCustomerId: customerId })
          .where(eq(subscriptions.userId, session.user.id));
      } else {
        await db.insert(subscriptions).values({
          userId: session.user.id,
          stripeCustomerId: customerId,
          plan: "free",
          status: "inactive",
        });
      }
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: absoluteUrl("/dashboard/billing?success=true"),
      cancel_url: absoluteUrl("/dashboard/billing?canceled=true"),
      metadata: { userId: session.user.id },
      subscription_data: {
        metadata: { userId: session.user.id },
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
