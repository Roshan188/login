import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { projects, portfolios } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { projectSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { portfolioId, ...data } = body;

    if (!portfolioId) {
      return NextResponse.json({ error: "portfolioId is required" }, { status: 400 });
    }

    // Verify portfolio ownership
    const portfolio = await db.query.portfolios.findFirst({
      where: and(eq(portfolios.id, portfolioId), eq(portfolios.userId, session.user.id)),
    });

    if (!portfolio) {
      return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });
    }

    const validated = projectSchema.safeParse(data);
    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid data", details: validated.error.flatten() },
        { status: 400 },
      );
    }

    // Get max order for this portfolio
    const maxOrderResult = await db
      .select({ max: sql<number>`MAX(${projects.order})` })
      .from(projects)
      .where(eq(projects.portfolioId, portfolioId));

    const maxOrder = maxOrderResult[0]?.max ?? -1;
    const { startDate, endDate, ...restData } = validated.data;

    const [project] = await db
      .insert(projects)
      .values({
        portfolioId,
        slug: slugify(validated.data.title),
        order: maxOrder + 1,
        ...restData,
        imageUrl: restData.imageUrl || null,
        demoUrl: restData.demoUrl || null,
        githubUrl: restData.githubUrl || null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      })
      .returning();

    return NextResponse.json({ data: project }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
