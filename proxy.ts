import { type NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { updateSession } from "@/utils/supabase/middleware";

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

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const { response } = updateSession(request);

  const isAdminArea =
    pathname.startsWith("/admin") || pathname.startsWith("/owner");

  if (isAdminArea) {
    const isLogin =
      pathname === "/admin/login" || pathname === "/owner/login";
    const authenticated = await isAdminAuthenticated(request);

    if (!authenticated && !isLogin) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    if (authenticated && isLogin) {
      return NextResponse.redirect(new URL("/admin/site", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|pdf)$).*)",
  ],
};
