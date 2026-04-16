import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { portfolios } from "@/db/schema";
import { eq } from "drizzle-orm";
import { PortfolioList } from "@/components/dashboard/portfolio-list";

export const metadata: Metadata = { title: "My Portfolios" };
export const dynamic = "force-dynamic";

export default async function PortfoliosPage() {
  const session = await auth();
  if (!session) redirect("/auth/signin");

  const userPortfolios = await db.query.portfolios.findMany({
    where: eq(portfolios.userId, session.user.id),
    with: {
      projects: { columns: { id: true } },
    },
    orderBy: (p, { desc }) => [desc(p.updatedAt)],
  });

  return <PortfolioList portfolios={userPortfolios} />;
}
