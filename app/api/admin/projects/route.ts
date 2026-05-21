import { NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-guard";
import { db } from "@/lib/db";
import { projects } from "@/drizzle/schema";

const projectSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  link: z.string().optional(),
  imageUrl: z.string().optional(),
  tags: z.string().optional(),
  featured: z.boolean().optional(),
  sortOrder: z.number().optional(),
  published: z.boolean().optional(),
});

const patchSchema = z.object({
  id: z.number(),
  published: z.boolean(),
});

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const rows = await db.select().from(projects).orderBy(asc(projects.sortOrder));
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const parsed = projectSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const [row] = await db.insert(projects).values(parsed.data).returning();
  return NextResponse.json(row, { status: 201 });
}

export async function PUT(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await request.json();
  const id = Number(body.id);
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const parsed = projectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const [row] = await db
    .update(projects)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(projects.id, id))
    .returning();

  return NextResponse.json(row);
}

/** Quick toggle Active ↔ Archived without full form */
export async function PATCH(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const parsed = patchSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const [row] = await db
    .update(projects)
    .set({ published: parsed.data.published, updatedAt: new Date() })
    .where(eq(projects.id, parsed.data.id))
    .returning();

  return NextResponse.json(row);
}

export async function DELETE(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const id = Number(new URL(request.url).searchParams.get("id"));
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  await db.delete(projects).where(eq(projects.id, id));
  return NextResponse.json({ ok: true });
}
