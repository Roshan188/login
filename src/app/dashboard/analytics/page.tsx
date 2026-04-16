import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { portfolios } from "@/db/schema";
import { eq } from "drizzle-orm";
import { AnalyticsDashboard } from "@/components/dashboard/analytics-dashboard";

export const metadata: Metadata = { title: "Analytics" };
export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const session = await auth();
  if (!session) redirect("/auth/signin");

  const userPortfolios = await db.query.portfolios.findMany({
    where: eq(portfolios.userId, session.user.id),
    columns: { id: true, title: true, slug: true, viewCount: true },
  });

  const totalViews = userPortfolios.reduce((sum, p) => sum + p.viewCount, 0);

  return (
    <AnalyticsDashboard
      portfolios={userPortfolios}
      totalViews={totalViews}
    />
  );
}
