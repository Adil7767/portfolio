import { NextResponse } from "next/server";
import { z } from "zod";
import { ANALYTICS_EVENTS, recordAnalyticsEvent } from "@/lib/analytics";
import { getProfile } from "@/lib/data";
import { db } from "@/lib/db";
import { sendContactEmail } from "@/lib/email";
import { contactMessages } from "@/drizzle/schema";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(1),
});

const DEFAULT_NOTIFY_EMAIL = "dev.adil786@gmail.com";

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const profile = await getProfile();
  const notifyEmail = profile?.email?.trim() || DEFAULT_NOTIFY_EMAIL;

  await db.insert(contactMessages).values(parsed.data);

  const emailSent = await sendContactEmail({
    ...parsed.data,
    toEmail: notifyEmail,
  });

  await recordAnalyticsEvent({
    eventType: ANALYTICS_EVENTS.CONTACT_SUBMIT,
    path: "/api/contact",
  });

  return NextResponse.json({ ok: true, emailSent });
}
