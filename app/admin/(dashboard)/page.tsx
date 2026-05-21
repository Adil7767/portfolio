import Link from "next/link";
import { ExternalLink, FileText, FolderKanban } from "lucide-react";
import DashboardAnalytics from "@/components/admin/DashboardAnalytics";
import AdminShell from "@/components/admin/AdminShell";
import { getAllProjects, getContactMessages, getProfile } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [profileData, projectsList, messages] = await Promise.all([
    getProfile(),
    getAllProjects(),
    getContactMessages(),
  ]);

  const unread = messages.filter((m) => !m.read).length;

  return (
    <AdminShell
      title={`Welcome, ${profileData?.name?.split(" ")[0] ?? "Owner"}`}
      description="Manage your public portfolio from one place."
      action={
        <Link href="/" target="_blank" className="btn-secondary !text-xs">
          <ExternalLink size={16} />
          Live preview
        </Link>
      }
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total projects" value={projectsList.length} href="/admin/projects" />
        <StatCard
          label="Active (public)"
          value={projectsList.filter((p) => p.published).length}
          href="/admin/projects"
        />
        <StatCard
          label="Archived"
          value={projectsList.filter((p) => !p.published).length}
          href="/admin/projects"
        />
        <StatCard
          label="Messages"
          value={messages.length}
          href="/admin/site"
          badge={unread > 0 ? unread : undefined}
        />
      </div>

      <DashboardAnalytics />

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <Link href="/admin/site" className="admin-card group transition hover:border-[var(--color-accent)]/40">
          <FileText className="mb-4 text-[var(--color-accent-soft)]" size={28} />
          <h3 className="font-semibold">Edit site content</h3>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            Resume URL, bio, images, social links, services, skills, and section headings.
          </p>
          <span className="mt-4 inline-block text-sm text-[var(--color-accent-soft)] group-hover:underline">
            Open editor →
          </span>
        </Link>
        <Link href="/admin/projects" className="admin-card group transition hover:border-[var(--color-accent)]/40">
          <FolderKanban className="mb-4 text-[var(--color-glow)]" size={28} />
          <h3 className="font-semibold">Manage projects</h3>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            Active/archived visibility, Cloudinary images, and featured flags.
          </p>
          <span className="mt-4 inline-block text-sm text-[var(--color-accent-soft)] group-hover:underline">
            Manage projects →
          </span>
        </Link>
      </div>

      {profileData?.resumeUrl && (
        <div className="admin-card mt-8">
          <p className="text-sm text-[var(--color-muted)]">Current resume link</p>
          <a
            href={profileData.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-2 text-[var(--color-accent-soft)] hover:underline"
          >
            {profileData.resumeUrl}
            <ExternalLink size={14} />
          </a>
        </div>
      )}

      <section className="mt-10">
        <h2 className="font-display text-lg font-semibold">Recent messages</h2>
        <div className="mt-4 space-y-3">
          {messages.slice(0, 5).map((m) => (
            <div key={m.id} className="admin-card !py-4">
              <div className="flex justify-between gap-4 text-sm">
                <span className="font-medium">{m.name}</span>
                <span className="text-[var(--color-muted)]">{m.email}</span>
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-[var(--color-muted)]">{m.message}</p>
            </div>
          ))}
          {messages.length === 0 && (
            <p className="text-sm text-[var(--color-muted)]">No messages yet.</p>
          )}
        </div>
      </section>
    </AdminShell>
  );
}

function StatCard({
  label,
  value,
  href,
  accent,
  badge,
}: {
  label: string;
  value: number;
  href: string;
  accent?: boolean;
  badge?: number;
}) {
  return (
    <Link href={href} className="admin-card transition hover:border-[var(--color-accent)]/30">
      <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-muted)]">
        {label}
        {badge != null && badge > 0 && (
          <span className="ml-2 rounded-full bg-amber-500/20 px-2 py-0.5 text-amber-400">
            {badge} new
          </span>
        )}
      </p>
      <p className={`mt-2 font-display text-4xl font-bold ${accent ? "text-amber-400" : ""}`}>
        {value}
      </p>
    </Link>
  );
}
