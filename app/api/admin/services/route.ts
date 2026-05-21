import { NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-guard";
import { db } from "@/lib/db";
import { services } from "@/drizzle/schema";

const schema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  iconUrl: z.string().optional(),
  sortOrder: z.number().optional(),
  published: z.boolean().optional(),
});

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  const rows = await db
    .select()
    .from(services)
    .orderBy(asc(services.sortOrder));
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const [row] = await db.insert(services).values(parsed.data).returning();
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
    .update(services)
    .set(parsed.data)
    .where(eq(services.id, id))
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
    .update(services)
    .set({ published })
    .where(eq(services.id, id))
    .returning();
  return NextResponse.json(row);
}

export async function DELETE(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const id = Number(new URL(request.url).searchParams.get("id"));
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await db.delete(services).where(eq(services.id, id));
  return NextResponse.json({ ok: true });
}
