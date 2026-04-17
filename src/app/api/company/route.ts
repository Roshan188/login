import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { companies, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { slugify } from "@/lib/utils";

const companySchema = z.object({
  name: z.string().min(2).max(100),
  website: z.string().url().optional().or(z.literal("")),
  description: z.string().max(1000).optional(),
  industry: z.string().max(100).optional(),
  size: z.enum(["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"]).optional(),
  location: z.string().max(100).optional(),
  tier: z.enum(["startup", "growth", "enterprise"]).default("startup"),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Check if company already exists for this user
    const existing = await db.query.companies.findFirst({
      where: eq(companies.userId, session.user.id),
    });
    if (existing) return NextResponse.json({ error: "Company already registered" }, { status: 409 });

    const body = await req.json();
    const validated = companySchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json({ error: "Invalid data", details: validated.error.flatten() }, { status: 400 });
    }

    const { name, tier, ...rest } = validated.data;
    const slug = slugify(name) + "-" + session.user.id.slice(0, 6);

    const contactLimits = { startup: 10, growth: 50, enterprise: 200 };

    const [company] = await db.insert(companies).values({
      userId: session.user.id,
      name,
      slug,
      tier,
      contactsLimit: contactLimits[tier],
      website: rest.website || null,
      description: rest.description,
      industry: rest.industry,
      size: rest.size,
      location: rest.location,
    }).returning();

    // Update user role to company
    await db.update(users).set({ role: "company", updatedAt: new Date() }).where(eq(users.id, session.user.id));

    return NextResponse.json({ data: company }, { status: 201 });
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
    return NextResponse.json({ data: company ?? null });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
