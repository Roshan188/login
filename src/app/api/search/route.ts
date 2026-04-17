import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { portfolios } from "@/db/schema";
import { eq, and, ilike, or } from "drizzle-orm";
import { z } from "zod";
import { rateLimit, getIp } from "@/lib/rate-limit";

const searchSchema = z.object({
  q: z.string().max(100).optional(),
  tech: z.string().optional(),
  location: z.string().max(100).optional(),
  hireable: z.coerce.boolean().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
});

export async function GET(req: NextRequest) {
  const rl = rateLimit(`search:${getIp(req)}`, 30, 60_000);
  if (!rl.success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const { searchParams } = req.nextUrl;
    const parsed = searchSchema.safeParse(Object.fromEntries(searchParams));

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid query params" }, { status: 400 });
    }

    const { q, tech, location, hireable, page, limit } = parsed.data;
    const offset = (page - 1) * limit;

    // Build conditions
    const conditions = [eq(portfolios.isPublic, true)];

    if (q) {
      conditions.push(
        or(
          ilike(portfolios.title, `%${q}%`),
          ilike(portfolios.bio, `%${q}%`),
          ilike(portfolios.headline, `%${q}%`),
        )!,
      );
    }

    const results = await db.query.portfolios.findMany({
      where: and(...conditions),
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            image: true,
            location: true,
            isHireable: true,
            experienceLevel: true,
          },
        },
        projects: {
          columns: { techStack: true },
          where: (p, { eq: eqFn }) => eqFn(p.status, "published"),
        },
      },
      orderBy: (p, { desc }) => [desc(p.viewCount)],
      limit,
      offset,
    });

    // Post-filter by tech stack and hireable (in memory for now — add DB indexes later)
    let filtered = results;

    if (tech) {
      const techLower = tech.toLowerCase();
      filtered = filtered.filter((p) =>
        p.projects.some((proj) =>
          (proj.techStack as string[]).some((t) => t.toLowerCase().includes(techLower)),
        ),
      );
    }

    if (location) {
      filtered = filtered.filter((p) =>
        p.user.location?.toLowerCase().includes(location.toLowerCase()),
      );
    }

    if (hireable !== undefined) {
      filtered = filtered.filter((p) => p.user.isHireable === hireable);
    }

    return NextResponse.json({
      data: filtered,
      meta: { page, limit, total: filtered.length },
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
