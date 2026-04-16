import type { MetadataRoute } from "next";
import { db } from "@/db";
import { portfolios } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://devfolio.dev";

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/explore`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.9 },
    { url: `${baseUrl}/pricing`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/for-companies`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];

  let portfolioRoutes: MetadataRoute.Sitemap = [];
  try {
    const publicPortfolios = await db.query.portfolios.findMany({
      where: eq(portfolios.isPublic, true),
      columns: { slug: true, updatedAt: true },
    });

    portfolioRoutes = publicPortfolios.map((p) => ({
      url: `${baseUrl}/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch {
    // DB not available at build time
  }

  return [...staticRoutes, ...portfolioRoutes];
}
