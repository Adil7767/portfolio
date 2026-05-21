import { NextResponse } from "next/server";
import { z } from "zod";
import { ANALYTICS_EVENTS, recordAnalyticsEvent } from "@/lib/analytics";

const schema = z.object({
  eventType: z.enum([
    ANALYTICS_EVENTS.PORTFOLIO_VIEW,
    ANALYTICS_EVENTS.RESUME_DOWNLOAD,
    ANALYTICS_EVENTS.PROJECTS_LOAD_MORE,
    ANALYTICS_EVENTS.PROJECT_READ_MORE,
    ANALYTICS_EVENTS.PROJECT_LINK_CLICK,
    ANALYTICS_EVENTS.CONTACT_SUBMIT,
  ]),
  entityId: z.number().int().positive().optional(),
  entityLabel: z.string().max(255).optional(),
  path: z.string().max(512).optional(),
  meta: z.record(z.unknown()).optional(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid event" }, { status: 400 });
  }

  await recordAnalyticsEvent(parsed.data);
  return NextResponse.json({ ok: true });
}
