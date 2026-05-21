"use client";

import { useEffect } from "react";
import { ANALYTICS_EVENTS } from "@/lib/analytics-events";
import { trackEvent } from "@/lib/track-client";

export default function ProjectDetailTracker({
  projectId,
  projectName,
}: {
  projectId: number;
  projectName: string;
}) {
  useEffect(() => {
    trackEvent(ANALYTICS_EVENTS.PROJECT_DETAIL_VIEW, {
      entityId: projectId,
      entityLabel: projectName,
    });
  }, [projectId, projectName]);

  return null;
}
