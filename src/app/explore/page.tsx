import type { Metadata } from "next";

export const dynamic = "force-dynamic";
import { db } from "@/db";
import { portfolios } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { ExploreGrid } from "@/components/explore/explore-grid";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export const metadata: Metadata = {
  title: "Explore Portfolios",
  description: "Discover talented developers and their amazing projects on DevFolio.",
};

export default async function ExplorePage() {
  const publicPortfolios = await db.query.portfolios.findMany({
    where: eq(portfolios.isPublic, true),
    with: {
      user: true,
      projects: {
        where: (p, { eq: eqFn }) => eqFn(p.status, "published"),
        limit: 3,
        orderBy: (p, { desc: descFn }) => [descFn(p.featured)],
      },
    },
    orderBy: [desc(portfolios.viewCount)],
    limit: 24,
  });

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 container py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Explore Developers</h1>
          <p className="text-muted-foreground">
            Discover talented developers and their projects.
          </p>
        </div>
        <ExploreGrid portfolios={publicPortfolios} />
      </main>
      <SiteFooter />
    </div>
  );
}
