"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, ExternalLink, RefreshCw, RotateCcw, Save } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import ItemEditor from "@/components/admin/ItemEditor";
import MediaUpload from "@/components/admin/MediaUpload";
import { fetchAdminJson } from "@/lib/admin-fetch";

type ProfileForm = {
  name: string;
  headline: string;
  tagline: string;
  bio: string;
  email: string;
  location: string;
  resumeUrl: string;
  avatarUrl: string;
  heroImageUrl: string;
  roles: string;
  availabilityLabel: string;
  servicesHeading: string;
  projectsHeading: string;
  contactHeading: string;
};

const profileDefaults: ProfileForm = {
  name: "",
  headline: "",
  tagline: "",
  bio: "",
  email: "",
  location: "",
  resumeUrl: "",
  avatarUrl: "/mine.png",
  heroImageUrl: "/mine.png",
  roles: "Full Stack Developer,Front End Engineer,Mobile App Developer",
  availabilityLabel: "Open to new opportunities",
  servicesHeading: "What I Offer",
  projectsHeading: "Selected Work",
  contactHeading: "Let's build something",
};

type Tab = "profile" | "social" | "services" | "skills";

export default function AdminSitePage() {
  const [tab, setTab] = useState<Tab>("profile");
  const [profile, setProfile] = useState<ProfileForm>(profileDefaults);
  const [social, setSocial] = useState<{ id: number; name: string }[]>([]);
  const [services, setServices] = useState<{ id: number; name: string }[]>([]);
  const [skills, setSkills] = useState<{ id: number; name: string }[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [restoring, setRestoring] = useState(false);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setLoadError(null);

    const res = await fetchAdminJson<{
      profile: Record<string, string | null> | null;
      socialLinks: { id: number; name: string }[];
      services: { id: number; name: string }[];
      skills: { id: number; name: string }[];
    }>("/api/admin/site-data");

    if (res.error) {
      const hasCached =
        Boolean(profile.name) ||
        social.length > 0 ||
        services.length > 0 ||
        skills.length > 0;
      setLoadError(
        hasCached
          ? `Refresh failed: ${res.error}. Showing last loaded data — click Retry load.`
          : res.error
      );
      setLoading(false);
      if (!hasCached) return;
      return;
    }

    const data = res.data;
    if (!data) {
      setLoadError("No data returned from server");
      setLoading(false);
      return;
    }

    const p = data.profile;
    if (p) {
      setProfile({
        name: p.name ?? "",
        headline: p.headline ?? "",
        tagline: p.tagline ?? "",
        bio: p.bio ?? "",
        email: p.email ?? "",
        location: p.location ?? "",
        resumeUrl: p.resumeUrl ?? "",
        avatarUrl: p.avatarUrl ?? "/mine.png",
        heroImageUrl: p.heroImageUrl ?? "/mine.png",
        roles: p.roles ?? profileDefaults.roles,
        availabilityLabel: p.availabilityLabel ?? profileDefaults.availabilityLabel,
        servicesHeading: p.servicesHeading ?? profileDefaults.servicesHeading,
        projectsHeading: p.projectsHeading ?? profileDefaults.projectsHeading,
        contactHeading: p.contactHeading ?? profileDefaults.contactHeading,
      });
    }

    if (Array.isArray(data.socialLinks)) setSocial(data.socialLinks);
    if (Array.isArray(data.services)) setServices(data.services);
    if (Array.isArray(data.skills)) setSkills(data.skills);

    setLoading(false);
  }, []);

  async function restoreDefaults() {
    if (
      !confirm(
        "Restore default profile, social links, services, skills, and projects only where tables are empty. Existing data is kept."
      )
    ) {
      return;
    }
    setRestoring(true);
    setLoadError(null);
    const res = await fetch("/api/admin/restore-defaults", {
      method: "POST",
      credentials: "include",
    });
    const json = await res.json();
    setRestoring(false);
    if (!res.ok) {
      setLoadError(json.error ?? "Restore failed");
      return;
    }
    alert(json.message ?? "Defaults restored");
    await loadAll();
  }

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  async function saveProfileFields(fields: Partial<ProfileForm>) {
    const next = { ...profile, ...fields };
    setProfile(next);
    setSaving(true);
    setSaved(false);
    const res = await fetch("/api/admin/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
    setSaving(false);
    if (res.ok) setSaved(true);
  }

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    const res = await fetch("/api/admin/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    setSaving(false);
    if (res.ok) setSaved(true);
  }

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: "profile", label: "Profile & Resume" },
    { id: "social", label: "Social Links", count: social.length },
    { id: "services", label: "Services", count: services.length },
    { id: "skills", label: "Skills", count: skills.length },
  ];

  return (
    <AdminShell
      title="Site content"
      description="Edit everything visitors see on your public portfolio — resume link, bio, images, headings, and more."
      action={
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => loadAll()}
            disabled={loading}
            className="btn-secondary !text-xs"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Retry load
          </button>
          <button
            type="button"
            onClick={restoreDefaults}
            disabled={restoring || loading}
            className="btn-secondary !text-xs"
          >
            <RotateCcw size={16} />
            {restoring ? "Restoring…" : "Restore defaults"}
          </button>
          <Link href="/" target="_blank" className="btn-secondary !text-xs">
            <ExternalLink size={16} />
            Preview live site
          </Link>
        </div>
      }
    >
      {loadError && (
        <div className="mb-6 flex flex-wrap items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          <AlertCircle size={20} className="shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="font-medium">Could not load content from the database</p>
            <p className="mt-1 text-red-300/90">{loadError}</p>
            <p className="mt-2 text-xs text-red-300/80">
              Set <code>DIRECT_URL</code> to{" "}
              <code>postgresql://postgres:…@db.[ref].supabase.co:5432/postgres</code> in{" "}
              <code>.env</code> and Vercel (not the pooler host on 5432). Redeploy after changing env vars.
            </p>
          </div>
          <button type="button" onClick={() => loadAll()} className="btn-secondary !py-1.5 !text-xs">
            Retry
          </button>
        </div>
      )}

      {loading && (
        <p className="mb-4 text-sm text-[var(--color-muted)]">Loading site content…</p>
      )}

      <div className="admin-tabs">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            data-active={tab === t.id}
            className="admin-tab"
            onClick={() => setTab(t.id)}
          >
            {t.label}
            {t.count != null && (
              <span className="ml-2 rounded-full bg-[var(--color-surface-elevated)] px-2 py-0.5 text-xs">
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {tab === "profile" && (
        <form onSubmit={saveProfile} className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <section className="admin-card">
              <h3 className="text-lg font-semibold">Identity</h3>
              <p className="mt-1 mb-6 text-sm text-[var(--color-muted)]">
                Name, title, and rotating role labels in the hero
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name" value={profile.name} onChange={(v) => setProfile({ ...profile, name: v })} />
                <Field label="Headline" value={profile.headline} onChange={(v) => setProfile({ ...profile, headline: v })} />
                <Field label="Availability badge" value={profile.availabilityLabel} onChange={(v) => setProfile({ ...profile, availabilityLabel: v })} className="sm:col-span-2" />
                <Field label="Tagline" value={profile.tagline} onChange={(v) => setProfile({ ...profile, tagline: v })} className="sm:col-span-2" />
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-medium text-[var(--color-muted)]">
                    Rotating roles (comma-separated)
                  </label>
                  <input
                    value={profile.roles}
                    onChange={(e) => setProfile({ ...profile, roles: e.target.value })}
                    className="input-field"
                    placeholder="Full Stack Developer, Mobile Developer"
                  />
                </div>
              </div>
            </section>

            <section className="admin-card border-[var(--color-accent)]/30">
              <h3 className="text-lg font-semibold">Resume file</h3>
              <p className="mt-1 mb-4 text-sm text-[var(--color-muted)]">
                Upload a PDF to Cloudinary or paste any public URL. Powers the Download resume button on your site.
              </p>
              <MediaUpload
                label="Resume PDF"
                hint="Upload PDF — saved to Cloudinary and linked on your public site instantly"
                value={profile.resumeUrl}
                onChange={(url) => setProfile({ ...profile, resumeUrl: url })}
                onUploadComplete={(url) => saveProfileFields({ resumeUrl: url })}
                folder="resume"
                accept="application/pdf,.pdf"
                resourceType="raw"
                preview="file"
                aspect="wide"
              />
              <p className="mt-2 text-xs text-[var(--color-muted)]">
                Public button uses <code className="text-[var(--color-accent-soft)]">/resume</code> and always serves this file.
              </p>
              {profile.resumeUrl && (
                <div className="mt-3 flex flex-wrap gap-4 text-sm">
                  <a
                    href="/resume"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[var(--color-accent-soft)] hover:underline"
                  >
                    <ExternalLink size={14} />
                    Preview public /resume
                  </a>
                  <a
                    href={profile.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--color-muted)] hover:underline"
                  >
                    Direct Cloudinary URL
                  </a>
                </div>
              )}
            </section>

            <section className="admin-card">
              <h3 className="text-lg font-semibold">About & contact</h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field label="Email" value={profile.email} onChange={(v) => setProfile({ ...profile, email: v })} />
                <Field label="Location" value={profile.location} onChange={(v) => setProfile({ ...profile, location: v })} />
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-medium text-[var(--color-muted)]">Bio</label>
                  <textarea
                    rows={5}
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>
            </section>

            <section className="admin-card">
              <h3 className="text-lg font-semibold">Section headings</h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <Field label="Services" value={profile.servicesHeading} onChange={(v) => setProfile({ ...profile, servicesHeading: v })} />
                <Field label="Projects" value={profile.projectsHeading} onChange={(v) => setProfile({ ...profile, projectsHeading: v })} />
                <Field label="Contact" value={profile.contactHeading} onChange={(v) => setProfile({ ...profile, contactHeading: v })} />
              </div>
            </section>

            <button type="submit" disabled={saving} className="btn-primary">
              <Save size={18} />
              {saving ? "Saving..." : "Save all profile settings"}
            </button>
            {saved && (
              <p className="text-sm text-[var(--color-success)]">
                Saved. Refresh your public site to see changes.
              </p>
            )}
          </div>

          <aside className="space-y-4">
            <div className="admin-card sticky top-8 space-y-6">
              <MediaUpload
                label="Profile photo"
                hint="Hero & avatar · Cloudinary folder: avatar"
                value={profile.avatarUrl}
                onChange={(url) => setProfile({ ...profile, avatarUrl: url })}
                folder="avatar"
                aspect="square"
              />
              <MediaUpload
                label="Hero image"
                hint="Large portrait on homepage"
                value={profile.heroImageUrl}
                onChange={(url) => setProfile({ ...profile, heroImageUrl: url })}
                folder="hero"
                aspect="video"
              />
            </div>
          </aside>
        </form>
      )}

      {tab === "social" && (
        <ItemEditor
          title="Social links"
          description="GitHub, LinkedIn, and other profiles shown in hero and contact"
          apiPath="/api/admin/social-links"
          fields={[
            { key: "name", label: "Name" },
            { key: "url", label: "URL", type: "url" },
            { key: "iconUrl", label: "Icon image", type: "upload", uploadFolder: "icons" },
            { key: "sortOrder", label: "Sort order", type: "number" },
          ]}
          emptyItem={{ name: "", url: "", iconUrl: "", sortOrder: 0, published: true }}
          items={social}
          onRefresh={loadAll}
          withVisibility
          loading={loading}
          loadError={loadError}
          allowReorder
          allowDuplicate
        />
      )}

      {tab === "services" && (
        <ItemEditor
          title="Services"
          description="Active services show on the public site; archive to hide."
          apiPath="/api/admin/services"
          fields={[
            { key: "name", label: "Title" },
            { key: "description", label: "Description", type: "textarea" },
            { key: "iconUrl", label: "Icon", type: "upload", uploadFolder: "services" },
            { key: "sortOrder", label: "Sort order", type: "number" },
          ]}
          emptyItem={{ name: "", description: "", iconUrl: "", sortOrder: 0, published: true }}
          items={services}
          onRefresh={loadAll}
          withVisibility
          loading={loading}
          loadError={loadError}
          allowReorder
          allowDuplicate
        />
      )}

      {tab === "skills" && (
        <ItemEditor
          title="Skills & tools"
          description="Active skills appear in your About section."
          apiPath="/api/admin/skills"
          fields={[
            { key: "name", label: "Name" },
            { key: "iconUrl", label: "Icon", type: "upload", uploadFolder: "icons" },
            { key: "sortOrder", label: "Sort order", type: "number" },
          ]}
          emptyItem={{ name: "", iconUrl: "", sortOrder: 0, published: true }}
          items={skills}
          onRefresh={loadAll}
          withVisibility
          loading={loading}
          loadError={loadError}
          allowReorder
          allowDuplicate
        />
      )}
    </AdminShell>
  );
}

function Field({
  label,
  value,
  onChange,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1 block text-xs font-medium text-[var(--color-muted)]">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="input-field" />
    </div>
  );
}
