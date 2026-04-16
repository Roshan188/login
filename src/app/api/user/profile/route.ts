import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { userProfileSchema } from "@/lib/validations";

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validated = userProfileSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid data", details: validated.error.flatten() },
        { status: 400 },
      );
    }

    // Check username uniqueness if changed
    if (validated.data.username) {
      const existing = await db.query.users.findFirst({
        where: eq(users.username, validated.data.username),
        columns: { id: true },
      });
      if (existing && existing.id !== session.user.id) {
        return NextResponse.json({ error: "Username already taken" }, { status: 409 });
      }
    }

    const [updated] = await db
      .update(users)
      .set({
        ...validated.data,
        website: validated.data.website || null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, session.user.id))
      .returning();

    return NextResponse.json({ data: updated });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
    });

    return NextResponse.json({ data: user });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
