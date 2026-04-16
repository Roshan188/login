import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { portfolios } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ProjectForm } from "@/components/dashboard/project-form";

export const metadata: Metadata = { title: "Add Project" };
export const dynamic = "force-dynamic";

export default async function NewProjectPage() {
  const session = await auth();
  if (!session) redirect("/auth/signin");

  const userPortfolios = await db.query.portfolios.findMany({
    where: eq(portfolios.userId, session.user.id),
    columns: { id: true, title: true },
  });

  if (userPortfolios.length === 0) {
    redirect("/dashboard/portfolios/new");
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Add Project</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Showcase a project in your portfolio.
        </p>
      </div>
      <ProjectForm portfolios={userPortfolios} />
    </div>
  );
}
