import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { portfolios } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ProjectList } from "@/components/dashboard/project-list";

export const metadata: Metadata = { title: "My Projects" };
export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const session = await auth();
  if (!session) redirect("/auth/signin");

  const userPortfolios = await db.query.portfolios.findMany({
    where: eq(portfolios.userId, session.user.id),
    with: {
      projects: {
        orderBy: (p, { asc, desc }) => [desc(p.featured), asc(p.order)],
      },
    },
  });

  return <ProjectList portfolios={userPortfolios} />;
}
