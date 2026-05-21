import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth";

export async function requireAdmin() {
  if (!(await verifyAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
