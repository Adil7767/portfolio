"use client";

import { useEffect } from "react";
import { ANALYTICS_EVENTS } from "@/lib/analytics-events";
import { trackEvent } from "@/lib/track-client";

/** Records one portfolio visit per browser session. */
export default function AnalyticsBeacon() {
  useEffect(() => {
    const key = "portfolio_view_tracked";
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    trackEvent(ANALYTICS_EVENTS.PORTFOLIO_VIEW);
  }, []);

  return null;
}
