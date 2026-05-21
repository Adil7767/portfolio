import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  adminSessionCookieOptions,
  signAdminToken,
  verifyAdminCredentials,
} from "@/lib/auth";
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

  const token = await signAdminToken();
  const response = NextResponse.json({
    ok: true,
    redirect: "/admin/site",
  });

  // Must set cookie on the response — cookies().set() in Route Handlers often omits Set-Cookie
  response.cookies.set(ADMIN_SESSION_COOKIE, token, adminSessionCookieOptions());

  return response;
}
