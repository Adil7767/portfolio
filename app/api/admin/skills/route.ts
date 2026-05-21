import { NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { z } from "zod";
import { withAdminHandler } from "@/lib/admin-api";
import { requireAdmin } from "@/lib/admin-guard";
import { db } from "@/lib/db";
import { skills } from "@/drizzle/schema";

const schema = z.object({
  name: z.string().min(1),
  iconUrl: z.string().min(1),
  sortOrder: z.number().optional(),
  published: z.boolean().optional(),
});

export async function GET() {
  return withAdminHandler(() =>
    db.select().from(skills).orderBy(asc(skills.sortOrder))
  );
}

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const [row] = await db.insert(skills).values(parsed.data).returning();
  return NextResponse.json(row, { status: 201 });
}

export async function PUT(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const body = await request.json();
  const id = Number(body.id);
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const [row] = await db
    .update(skills)
    .set(parsed.data)
    .where(eq(skills.id, id))
    .returning();
  return NextResponse.json(row);
}

export async function PATCH(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const body = await request.json();
  const id = Number(body.id);
  const published = body.published;
  if (!id || typeof published !== "boolean") {
    return NextResponse.json({ error: "id and published required" }, { status: 400 });
  }
  const [row] = await db
    .update(skills)
    .set({ published })
    .where(eq(skills.id, id))
    .returning();
  return NextResponse.json(row);
}

export async function DELETE(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const id = Number(new URL(request.url).searchParams.get("id"));
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await db.delete(skills).where(eq(skills.id, id));
  return NextResponse.json({ ok: true });
}
