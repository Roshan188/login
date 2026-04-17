import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { companies } from "@/db/schema";
import { eq } from "drizzle-orm";
import { CompanyLayout } from "@/components/company/company-layout";
import { DeveloperSearch } from "@/components/company/developer-search";

export const metadata: Metadata = { title: "Find Developers – DevFolio" };
export const dynamic = "force-dynamic";

export default async function CompanySearchPage() {
  const session = await auth();
  if (!session) redirect("/auth/signin");

  const company = await db.query.companies.findFirst({
    where: eq(companies.userId, session.user.id),
  });
  if (!company) redirect("/company/onboarding");

  return (
    <CompanyLayout company={company}>
      <DeveloperSearch company={company} />
    </CompanyLayout>
  );
}
