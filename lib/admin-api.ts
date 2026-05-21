import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { dbErrorMessage } from "@/lib/db";

export async function withAdminHandler<T>(
  handler: () => Promise<T>,
  init?: ResponseInit
) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const data = await handler();
    try {
      return NextResponse.json(data, init);
    } catch (serializeErr) {
      console.error("[admin-api] JSON serialize", serializeErr);
      return NextResponse.json(
        { error: "Response could not be serialized" },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error("[admin-api]", err);
    return NextResponse.json({ error: dbErrorMessage(err) }, { status: 503 });
  }
}
