import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";
import { projectSchema } from "@/lib/validations";

type RouteContext = { params: Promise<{ id: string }> };

async function verifyProjectOwnership(projectId: string, userId: string) {
  return db.query.projects.findFirst({
    where: eq(projects.id, projectId),
    with: {
      portfolio: {
        columns: { userId: true },
      },
    },
  }).then((p) => (p?.portfolio.userId === userId ? p : null));
}

export async function GET(_req: NextRequest, { params }: RouteContext) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const project = await verifyProjectOwnership(id, session.user.id);
    if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ data: project });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const existing = await verifyProjectOwnership(id, session.user.id);
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const body = await req.json();
    const validated = projectSchema.partial().safeParse(body);
    if (!validated.success) {
      return NextResponse.json({ error: "Invalid data", details: validated.error.flatten() }, { status: 400 });
    }

    const { startDate, endDate, ...rest } = validated.data;
    const [updated] = await db
      .update(projects)
      .set({
        ...rest,
        imageUrl: rest.imageUrl !== undefined ? (rest.imageUrl || null) : undefined,
        demoUrl: rest.demoUrl !== undefined ? (rest.demoUrl || null) : undefined,
        githubUrl: rest.githubUrl !== undefined ? (rest.githubUrl || null) : undefined,
        startDate: startDate ? new Date(startDate) : startDate === "" ? null : undefined,
        endDate: endDate ? new Date(endDate) : endDate === "" ? null : undefined,
        updatedAt: new Date(),
      })
      .where(eq(projects.id, id))
      .returning();

    return NextResponse.json({ data: updated });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const existing = await verifyProjectOwnership(id, session.user.id);
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await db.delete(projects).where(eq(projects.id, id));
    return NextResponse.json({ message: "Project deleted" });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
