import { and, count, desc, gte, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { analyticsEvents } from "@/drizzle/schema";
import {
  ANALYTICS_EVENTS,
  type AnalyticsEventType,
} from "@/lib/analytics-events";

export { ANALYTICS_EVENTS, type AnalyticsEventType };

const TRACKABLE = new Set<string>(Object.values(ANALYTICS_EVENTS));

export async function recordAnalyticsEvent(input: {
  eventType: AnalyticsEventType | string;
  entityId?: number | null;
  entityLabel?: string | null;
  path?: string | null;
  meta?: Record<string, unknown> | null;
}) {
  if (!TRACKABLE.has(input.eventType)) return;

  await db.insert(analyticsEvents).values({
    eventType: input.eventType,
    entityId: input.entityId ?? null,
    entityLabel: input.entityLabel?.slice(0, 255) ?? null,
    path: input.path?.slice(0, 512) ?? null,
    meta: input.meta ? JSON.stringify(input.meta) : null,
  });
}

function sinceDays(days: number) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

async function countByType(eventTypes: string[], from?: Date) {
  const conditions = [inArray(analyticsEvents.eventType, eventTypes)];
  if (from) conditions.push(gte(analyticsEvents.createdAt, from));

  const rows = await db
    .select({
      eventType: analyticsEvents.eventType,
      total: count(),
    })
    .from(analyticsEvents)
    .where(and(...conditions))
    .groupBy(analyticsEvents.eventType);

  const map: Record<string, number> = {};
  for (const row of rows) map[row.eventType] = Number(row.total);
  return map;
}

async function topProjects(from?: Date, limit = 8) {
  const conditions = [
    inArray(analyticsEvents.eventType, [
      ANALYTICS_EVENTS.PROJECT_LINK_CLICK,
      ANALYTICS_EVENTS.PROJECT_READ_MORE,
      ANALYTICS_EVENTS.PROJECT_DETAIL_VIEW,
    ]),
  ];
  if (from) conditions.push(gte(analyticsEvents.createdAt, from));

  const rows = await db
    .select({
      entityId: analyticsEvents.entityId,
      entityLabel: analyticsEvents.entityLabel,
      interactions: count(),
    })
    .from(analyticsEvents)
    .where(and(...conditions))
    .groupBy(analyticsEvents.entityId, analyticsEvents.entityLabel)
    .orderBy(desc(count()))
    .limit(limit);

  return rows.map((r) => ({
    entityId: r.entityId,
    name: r.entityLabel ?? "Unknown project",
    interactions: Number(r.interactions),
  }));
}

export async function getAnalyticsSummary() {
  const allTypes = Object.values(ANALYTICS_EVENTS);
  const [allTime, last7, last30, topAll, top7] = await Promise.all([
    countByType(allTypes),
    countByType(allTypes, sinceDays(7)),
    countByType(allTypes, sinceDays(30)),
    topProjects(),
    topProjects(sinceDays(7)),
  ]);

  const pick = (map: Record<string, number>, key: string) => map[key] ?? 0;

  const bundle = (map: Record<string, number>) => ({
    portfolioViews: pick(map, ANALYTICS_EVENTS.PORTFOLIO_VIEW),
    resumeDownloads: pick(map, ANALYTICS_EVENTS.RESUME_DOWNLOAD),
    projectsLoadMore: pick(map, ANALYTICS_EVENTS.PROJECTS_LOAD_MORE),
    projectReadMore: pick(map, ANALYTICS_EVENTS.PROJECT_READ_MORE),
    projectDetailViews: pick(map, ANALYTICS_EVENTS.PROJECT_DETAIL_VIEW),
    projectLinkClicks: pick(map, ANALYTICS_EVENTS.PROJECT_LINK_CLICK),
    contactSubmits: pick(map, ANALYTICS_EVENTS.CONTACT_SUBMIT),
    projectEngagement:
      pick(map, ANALYTICS_EVENTS.PROJECT_READ_MORE) +
      pick(map, ANALYTICS_EVENTS.PROJECT_DETAIL_VIEW) +
      pick(map, ANALYTICS_EVENTS.PROJECT_LINK_CLICK),
  });

  const recent = await db
    .select({
      id: analyticsEvents.id,
      eventType: analyticsEvents.eventType,
      entityLabel: analyticsEvents.entityLabel,
      path: analyticsEvents.path,
      createdAt: analyticsEvents.createdAt,
    })
    .from(analyticsEvents)
    .orderBy(desc(analyticsEvents.createdAt))
    .limit(12);

  return {
    allTime: bundle(allTime),
    last7Days: bundle(last7),
    last30Days: bundle(last30),
    topProjectsAllTime: topAll,
    topProjects7Days: top7,
    recent,
  };
}

export function formatEventLabel(eventType: string) {
  switch (eventType) {
    case ANALYTICS_EVENTS.RESUME_DOWNLOAD:
      return "Resume download";
    case ANALYTICS_EVENTS.PROJECTS_LOAD_MORE:
      return "Load more projects";
    case ANALYTICS_EVENTS.PROJECT_READ_MORE:
      return "Project details expanded";
    case ANALYTICS_EVENTS.PROJECT_DETAIL_VIEW:
      return "Project detail page";
    case ANALYTICS_EVENTS.PROJECT_LINK_CLICK:
      return "Project link opened";
    case ANALYTICS_EVENTS.PORTFOLIO_VIEW:
      return "Portfolio visit";
    case ANALYTICS_EVENTS.CONTACT_SUBMIT:
      return "Contact form sent";
    default:
      return eventType.replace(/_/g, " ");
  }
}
