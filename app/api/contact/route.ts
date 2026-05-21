import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { contactMessages } from "@/drizzle/schema";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(1),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  await db.insert(contactMessages).values(parsed.data);
  return NextResponse.json({ ok: true });
}
