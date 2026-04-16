import type { Metadata } from "next";

export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { portfolios, portfolioViews } from "@/db/schema";
import { eq } from "drizzle-orm";
import { PublicPortfolio } from "@/components/portfolio/public-portfolio";

interface PortfolioPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PortfolioPageProps): Promise<Metadata> {
  const { slug } = await params;
  const portfolio = await db.query.portfolios.findFirst({
    where: eq(portfolios.slug, slug),
    with: { user: true },
  });

  if (!portfolio || !portfolio.isPublic) {
    return { title: "Portfolio Not Found" };
  }

  return {
    title: portfolio.seoTitle ?? portfolio.title,
    description: portfolio.seoDescription ?? portfolio.bio ?? undefined,
    openGraph: {
      title: portfolio.title,
      description: portfolio.bio ?? undefined,
      type: "profile",
      url: `/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: portfolio.title,
    },
  };
}

export default async function PortfolioPage({ params }: PortfolioPageProps) {
  const { slug } = await params;
  const portfolio = await db.query.portfolios.findFirst({
    where: eq(portfolios.slug, slug),
    with: {
      user: true,
      projects: {
        where: (p, { eq: eqFn }) => eqFn(p.status, "published"),
        orderBy: (p, { asc, desc }) => [desc(p.featured), asc(p.order)],
      },
    },
  });

  if (!portfolio || !portfolio.isPublic) {
    notFound();
  }

  // Track view (fire and forget)
  db.insert(portfolioViews)
    .values({
      portfolioId: portfolio.id,
    })
    .catch(() => null);

  return <PublicPortfolio portfolio={portfolio} />;
}
