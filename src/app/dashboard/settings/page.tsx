import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { SettingsForm } from "@/components/dashboard/settings-form";

export const metadata: Metadata = { title: "Settings" };
export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await auth();
  if (!session) redirect("/auth/signin");

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  });

  if (!user) redirect("/auth/signin");

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your profile and account preferences.
        </p>
      </div>
      <SettingsForm user={user} />
    </div>
  );
}
