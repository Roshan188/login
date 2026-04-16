import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { portfolios } from "@/db/schema";
import { eq } from "drizzle-orm";
import { portfolioSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userPortfolios = await db.query.portfolios.findMany({
      where: eq(portfolios.userId, session.user.id),
      orderBy: (p, { desc }) => [desc(p.createdAt)],
    });

    return NextResponse.json({ data: userPortfolios });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validated = portfolioSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid data", details: validated.error.flatten() },
        { status: 400 },
      );
    }

    const { title, slug, ...rest } = validated.data;
    const finalSlug = slug || slugify(title);

    // Check slug uniqueness
    const existing = await db.query.portfolios.findFirst({
      where: eq(portfolios.slug, finalSlug),
    });

    if (existing) {
      return NextResponse.json({ error: "Slug already taken" }, { status: 409 });
    }

    const [portfolio] = await db
      .insert(portfolios)
      .values({
        userId: session.user.id,
        title,
        slug: finalSlug,
        ...rest,
      })
      .returning();

    return NextResponse.json({ data: portfolio }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
