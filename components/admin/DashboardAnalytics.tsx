import {
  BarChart3,
  Download,
  Eye,
  FolderOpen,
  Layers,
  Mail,
  MousePointerClick,
} from "lucide-react";
import { formatEventLabel, getAnalyticsSummary } from "@/lib/analytics";

export default async function DashboardAnalytics() {
  const stats = await getAnalyticsSummary();

  return (
    <section className="mt-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-lg font-semibold">Visitor analytics</h2>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Resume downloads, project engagement, load more clicks, and form activity.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-muted)]">
          <BarChart3 size={14} />
          Live from public site events
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <MetricCard
          icon={Eye}
          label="Portfolio visits"
          allTime={stats.allTime.portfolioViews}
          last7={stats.last7Days.portfolioViews}
          last30={stats.last30Days.portfolioViews}
        />
        <MetricCard
          icon={Download}
          label="Resume downloads"
          allTime={stats.allTime.resumeDownloads}
          last7={stats.last7Days.resumeDownloads}
          last30={stats.last30Days.resumeDownloads}
          accent
        />
        <MetricCard
          icon={Layers}
          label="Load more (projects)"
          allTime={stats.allTime.projectsLoadMore}
          last7={stats.last7Days.projectsLoadMore}
          last30={stats.last30Days.projectsLoadMore}
        />
        <MetricCard
          icon={FolderOpen}
          label="Project details opened"
          allTime={stats.allTime.projectReadMore}
          last7={stats.last7Days.projectReadMore}
          last30={stats.last30Days.projectReadMore}
        />
        <MetricCard
          icon={MousePointerClick}
          label="Project links clicked"
          allTime={stats.allTime.projectLinkClicks}
          last7={stats.last7Days.projectLinkClicks}
          last30={stats.last30Days.projectLinkClicks}
        />
        <MetricCard
          icon={Mail}
          label="Contact form sends"
          allTime={stats.allTime.contactSubmits}
          last7={stats.last7Days.contactSubmits}
          last30={stats.last30Days.contactSubmits}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <TopProjects title="Top projects (all time)" items={stats.topProjectsAllTime} />
        <TopProjects title="Top projects (last 7 days)" items={stats.topProjects7Days} />
      </div>

      <div className="admin-card mt-8">
        <h3 className="font-semibold">Recent activity</h3>
        <ul className="mt-4 divide-y divide-[var(--color-border)]">
          {stats.recent.length === 0 && (
            <li className="py-6 text-sm text-[var(--color-muted)]">
              No events yet. Visit the public site, download your resume, or click Load more to
              start collecting data.
            </li>
          )}
          {stats.recent.map((e) => (
            <li key={e.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
              <span className="text-[var(--color-foreground)]">
                {formatEventLabel(e.eventType)}
                {e.entityLabel ? (
                  <span className="text-[var(--color-muted)]"> · {e.entityLabel}</span>
                ) : null}
              </span>
              <time className="text-xs text-[var(--color-muted)]">
                {e.createdAt ? new Date(e.createdAt).toLocaleString() : "—"}
              </time>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function MetricCard({
  icon: Icon,
  label,
  allTime,
  last7,
  last30,
  accent,
}: {
  icon: typeof Eye;
  label: string;
  allTime: number;
  last7: number;
  last30: number;
  accent?: boolean;
}) {
  return (
    <div className="admin-card">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            accent
              ? "bg-[var(--color-accent)]/20 text-[var(--color-accent-soft)]"
              : "bg-[var(--color-surface-elevated)] text-[var(--color-muted)]"
          }`}
        >
          <Icon size={20} />
        </div>
        <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-muted)]">
          {label}
        </p>
      </div>
      <p
        className={`mt-4 font-display text-4xl font-bold ${
          accent ? "text-[var(--color-accent-soft)]" : ""
        }`}
      >
        {allTime}
      </p>
      <p className="mt-2 text-xs text-[var(--color-muted)]">
        <span className="text-[var(--color-foreground)]">{last7}</span> last 7 days ·{" "}
        <span className="text-[var(--color-foreground)]">{last30}</span> last 30 days
      </p>
    </div>
  );
}

function TopProjects({
  title,
  items,
}: {
  title: string;
  items: { name: string; interactions: number }[];
}) {
  return (
    <div className="admin-card">
      <h3 className="font-semibold">{title}</h3>
      {items.length === 0 ? (
        <p className="mt-4 text-sm text-[var(--color-muted)]">No project interactions yet.</p>
      ) : (
        <ol className="mt-4 space-y-3">
          {items.map((p, i) => (
            <li key={`${p.name}-${i}`} className="flex items-center justify-between gap-4 text-sm">
              <span className="truncate">
                <span className="mr-2 text-[var(--color-muted)]">{i + 1}.</span>
                {p.name}
              </span>
              <span className="shrink-0 rounded-full bg-[var(--color-accent)]/15 px-2.5 py-0.5 text-xs font-medium text-[var(--color-accent-soft)]">
                {p.interactions}
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
