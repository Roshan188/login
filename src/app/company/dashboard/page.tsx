import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { companies, contactRequests } from "@/db/schema";
import { eq } from "drizzle-orm";
import { CompanyDashboardOverview } from "@/components/company/dashboard-overview";

export const metadata: Metadata = { title: "Company Dashboard – DevFolio" };
export const dynamic = "force-dynamic";

export default async function CompanyDashboardPage() {
  const session = await auth();
  if (!session) redirect("/auth/signin");

  const company = await db.query.companies.findFirst({
    where: eq(companies.userId, session.user.id),
  });
  if (!company) redirect("/company/onboarding");

  const recentContacts = await db.query.contactRequests.findMany({
    where: eq(contactRequests.companyId, company.id),
    with: {
      developer: {
        columns: { id: true, name: true, image: true, headline: true },
      },
    },
    orderBy: (r, { desc }) => [desc(r.createdAt)],
    limit: 5,
  });

  return <CompanyDashboardOverview company={company} recentContacts={recentContacts} />;
}
