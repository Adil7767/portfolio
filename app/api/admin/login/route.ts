import { NextResponse } from "next/server";
import { createAdminSession, verifyAdminCredentials } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!verifyAdminCredentials(parsed.data.email, parsed.data.password)) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  await createAdminSession();
  return NextResponse.json({ ok: true });
}
