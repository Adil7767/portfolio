import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { verifyAdminSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { profile } from "@/drizzle/schema";
import { getProfile } from "@/lib/data";

const profileSchema = z.object({
  name: z.string().min(1).optional(),
  headline: z.string().optional(),
  tagline: z.string().optional(),
  bio: z.string().optional(),
  email: z.string().optional(),
  location: z.string().optional(),
  resumeUrl: z.string().optional(),
  avatarUrl: z.string().optional(),
  heroImageUrl: z.string().optional(),
  roles: z.string().optional(),
  availabilityLabel: z.string().optional(),
  servicesHeading: z.string().optional(),
  projectsHeading: z.string().optional(),
  contactHeading: z.string().optional(),
});

export async function GET() {
  if (!(await verifyAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const row = await getProfile();
  return NextResponse.json(row);
}

export async function PUT(request: Request) {
  if (!(await verifyAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = profileSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const existing = await getProfile();
  if (!existing) {
    const [row] = await db.insert(profile).values(parsed.data).returning();
    return NextResponse.json(row);
  }

  const [row] = await db
    .update(profile)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(profile.id, existing.id))
    .returning();

  return NextResponse.json(row);
}
