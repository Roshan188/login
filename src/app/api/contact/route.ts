import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { contactRequests, companies } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";
import { rateLimit, getIp } from "@/lib/rate-limit";

const contactSchema = z.object({
  developerId: z.string().uuid(),
  message: z.string().min(10).max(2000),
});

export async function POST(req: NextRequest) {
  const rl = rateLimit(`contact:${getIp(req)}`, 10, 60_000);
  if (!rl.success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const company = await db.query.companies.findFirst({
      where: eq(companies.userId, session.user.id),
    });
    if (!company) return NextResponse.json({ error: "Company profile required" }, { status: 403 });

    // Check contact limit
    if (company.contactsUsed >= company.contactsLimit) {
      return NextResponse.json({ error: "Contact limit reached. Upgrade your plan." }, { status: 402 });
    }

    const body = await req.json();
    const validated = contactSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json({ error: "Invalid data", details: validated.error.flatten() }, { status: 400 });
    }

    // Prevent duplicate contact
    const existing = await db.query.contactRequests.findFirst({
      where: and(
        eq(contactRequests.companyId, company.id),
        eq(contactRequests.developerId, validated.data.developerId),
      ),
    });
    if (existing) return NextResponse.json({ error: "Already contacted this developer" }, { status: 409 });

    const [request] = await db.insert(contactRequests).values({
      companyId: company.id,
      developerId: validated.data.developerId,
      message: validated.data.message,
    }).returning();

    // Increment usage
    await db.update(companies)
      .set({ contactsUsed: company.contactsUsed + 1, updatedAt: new Date() })
      .where(eq(companies.id, company.id));

    return NextResponse.json({ data: request }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const company = await db.query.companies.findFirst({
      where: eq(companies.userId, session.user.id),
    });
    if (!company) return NextResponse.json({ data: [] });

    const requests = await db.query.contactRequests.findMany({
      where: eq(contactRequests.companyId, company.id),
      with: { developer: { columns: { id: true, name: true, email: true, image: true } } },
      orderBy: (r, { desc }) => [desc(r.createdAt)],
    });

    return NextResponse.json({ data: requests });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
