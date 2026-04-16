import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { subscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { BillingDashboard } from "@/components/dashboard/billing-dashboard";

export const metadata: Metadata = { title: "Billing" };
export const dynamic = "force-dynamic";

export default async function BillingPage() {
  const session = await auth();
  if (!session) redirect("/auth/signin");

  const subscription = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.userId, session.user.id),
  });

  return <BillingDashboard subscription={subscription ?? null} />;
}
