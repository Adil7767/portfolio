import { NextResponse } from "next/server";
import { ANALYTICS_EVENTS, recordAnalyticsEvent } from "@/lib/analytics";
import { getProfile } from "@/lib/data";
import { cloudinary } from "@/lib/cloudinary-server";

export const dynamic = "force-dynamic";

function signedCloudinaryUrl(rawUrl: string): string {
  // Extract public_id from: https://res.cloudinary.com/CLOUD/raw/upload/vVERSION/PUBLIC_ID
  const match = rawUrl.match(/\/raw\/upload\/(?:v\d+\/)?(.+)$/);
  if (!match) return rawUrl;
  const publicId = match[1];
  return cloudinary.url(publicId, {
    resource_type: "raw",
    sign_url: true,
    secure: true,
    expires_at: Math.floor(Date.now() / 1000) + 60 * 10, // 10-minute window
  });
}

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

  const isCloudinaryRaw =
    url.includes("res.cloudinary.com") &&
    (url.includes("/raw/upload/") || url.includes("resource_type=raw"));

  const redirectUrl = isCloudinaryRaw ? signedCloudinaryUrl(url) : url;

  return NextResponse.redirect(redirectUrl, {
    status: 302,
    headers: {
      "Content-Disposition": 'inline; filename="Adil-Mustafa-Resume.pdf"',
    },
  });
}
