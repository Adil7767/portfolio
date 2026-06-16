import { NextResponse } from "next/server";
import { ANALYTICS_EVENTS, recordAnalyticsEvent } from "@/lib/analytics";
import { getProfile } from "@/lib/data";
import { cloudinary } from "@/lib/cloudinary-server";

export const dynamic = "force-dynamic";

function signedCloudinaryUrl(rawUrl: string): string {
  const match = rawUrl.match(/\/raw\/upload\/(?:v\d+\/)?(.+)$/);
  if (!match) return rawUrl;
  const publicId = match[1];
  return cloudinary.url(publicId, {
    resource_type: "raw",
    sign_url: true,
    secure: true,
    expires_at: Math.floor(Date.now() / 1000) + 60 * 10,
  });
}

/** Public resume — proxied so Content-Disposition is fully controlled.
 *  ?download=1  → forces file download
 *  (default)    → opens inline in the browser PDF viewer */
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

  const isCloudinaryRaw =
    url.includes("res.cloudinary.com") &&
    (url.includes("/raw/upload/") || url.includes("resource_type=raw"));

  const fetchUrl = isCloudinaryRaw ? signedCloudinaryUrl(url) : url;

  const upstream = await fetch(fetchUrl);
  if (!upstream.ok) {
    return NextResponse.json({ error: "Resume not available" }, { status: 502 });
  }

  const { searchParams } = new URL(request.url);
  const forceDownload = searchParams.get("download") === "1";

  const disposition = forceDownload
    ? 'attachment; filename="Adil-Mustafa-Resume.pdf"'
    : 'inline; filename="Adil-Mustafa-Resume.pdf"';

  return new NextResponse(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": disposition,
      "Cache-Control": "private, max-age=300",
    },
  });
}
