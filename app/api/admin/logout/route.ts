import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/lib/auth";

export async function POST() {
  const response = NextResponse.json({ ok: true, redirect: "/admin/login" });
  response.cookies.delete(ADMIN_SESSION_COOKIE);
  return response;
}
