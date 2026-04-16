import type { Metadata } from "next";

export const dynamic = "force-dynamic";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardOverview } from "@/components/dashboard/overview";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your DevFolio dashboard",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/auth/signin");

  return <DashboardOverview user={session.user} />;
}
