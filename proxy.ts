import { type NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "admin_session";

async function isAdminAuthenticated(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return false;

  const secret = process.env.SESSION_SECRET ?? process.env.ADMIN_PASSWORD;
  if (!secret) return false;

  try {
    await jwtVerify(token, new TextEncoder().encode(secret));
    return true;
  } catch {
    return false;
  }
}

/** Admin route protection only. DB uses Drizzle + DIRECT_URL (no Supabase Auth in middleware). */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminArea =
    pathname.startsWith("/admin") || pathname.startsWith("/owner");

  if (!isAdminArea) {
    return NextResponse.next();
  }

  const isLogin =
    pathname === "/admin/login" || pathname === "/owner/login";
  const authenticated = await isAdminAuthenticated(request);

  if (!authenticated && !isLogin) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (authenticated && isLogin) {
    return NextResponse.redirect(new URL("/admin/site", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/owner/:path*",
  ],
};
