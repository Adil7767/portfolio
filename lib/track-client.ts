import type { AnalyticsEventType } from "@/lib/analytics-events";

export function trackEvent(
  eventType: AnalyticsEventType,
  payload?: {
    entityId?: number;
    entityLabel?: string;
    meta?: Record<string, unknown>;
  }
) {
  if (typeof window === "undefined") return;

  fetch("/api/analytics/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      eventType,
      entityId: payload?.entityId,
      entityLabel: payload?.entityLabel,
      path: window.location.pathname,
      meta: payload?.meta,
    }),
    keepalive: true,
  }).catch(() => {});
}
