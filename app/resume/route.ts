import { NextResponse } from "next/server";
import { ANALYTICS_EVENTS, recordAnalyticsEvent } from "@/lib/analytics";
import { getProfile } from "@/lib/data";

export const dynamic = "force-dynamic";

/** Public resume download — always uses latest URL from database */
export async function GET(request: Request) {
  const profile = await getProfile();
  const url = profile?.resumeUrl?.trim();

  if (!url) {
    return NextResponse.json({ error: "Resume not available" }, { status: 404 });
  }

  await recordAnalyticsEvent({
    eventType: ANALYTICS_EVENTS.RESUME_DOWNLOAD,
    path: "/resume",
    meta: { referrer: request.headers.get("referer") ?? undefined },
  });

  const isPdf =
    url.includes(".pdf") ||
    url.includes("/raw/upload/") ||
    url.includes("resource_type=raw");

  return NextResponse.redirect(url, {
    status: 302,
    headers: isPdf
      ? {
          "Content-Disposition": 'inline; filename="Adil-Mustafa-Resume.pdf"',
        }
      : undefined,
  });
}
