import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { companies } from "@/db/schema";
import { eq } from "drizzle-orm";
import { CompanyOnboardingForm } from "@/components/company/onboarding-form";

export const metadata: Metadata = { title: "Company Onboarding – DevFolio" };
export const dynamic = "force-dynamic";

export default async function CompanyOnboardingPage() {
  const session = await auth();
  if (!session) redirect("/auth/signin");

  const existing = await db.query.companies.findFirst({
    where: eq(companies.userId, session.user.id),
  });
  if (existing) redirect("/company/dashboard");

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute top-1/4 -left-32 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
      <div className="relative z-10 w-full max-w-2xl px-4 py-12">
        <CompanyOnboardingForm />
      </div>
    </div>
  );
}
