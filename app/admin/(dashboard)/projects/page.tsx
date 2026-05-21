"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  Plus,
  Pencil,
  Trash2,
  Star,
  Archive,
  Globe,
  Filter,
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import ProjectForm from "@/components/admin/ProjectForm";
import StatusBadge from "@/components/admin/StatusBadge";
import type { projects } from "@/drizzle/schema";

type Project = typeof projects.$inferSelect;
type FilterTab = "all" | "active" | "archived";

export default function AdminProjectsPage() {
  const [list, setList] = useState<Project[]>([]);
  const [editing, setEditing] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<FilterTab>("all");
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/projects");
    if (res.ok) setList(await res.json());
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const counts = useMemo(
    () => ({
      all: list.length,
      active: list.filter((p) => p.published).length,
      archived: list.filter((p) => !p.published).length,
    }),
    [list]
  );

  const filtered = useMemo(() => {
    if (filter === "active") return list.filter((p) => p.published);
    if (filter === "archived") return list.filter((p) => !p.published);
    return list;
  }, [list, filter]);

  async function toggleVisibility(project: Project) {
    setTogglingId(project.id);
    await fetch("/api/admin/projects", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: project.id, published: !project.published }),
    });
    setTogglingId(null);
    load();
  }

  async function remove(id: number) {
    if (!confirm("Permanently delete this project?")) return;
    await fetch(`/api/admin/projects?id=${id}`, { method: "DELETE" });
    load();
  }

  const tabs: { id: FilterTab; label: string; count: number }[] = [
    { id: "all", label: "All", count: counts.all },
    { id: "active", label: "Active", count: counts.active },
    { id: "archived", label: "Archived", count: counts.archived },
  ];

  return (
    <AdminShell
      title="Projects"
      description="Active projects appear on your public portfolio. Archive old work to hide it without deleting."
      action={
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="btn-primary !py-2 !text-sm"
        >
          <Plus size={18} />
          New project
        </button>
      }
    >
      <div className="admin-card mb-8 flex flex-wrap items-center gap-4 !py-4">
        <Filter size={18} className="text-[var(--color-muted)]" />
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                filter === tab.id
                  ? "bg-[var(--color-accent)]/20 text-[var(--color-accent-soft)]"
                  : "text-[var(--color-muted)] hover:bg-[var(--color-surface-elevated)]"
              }`}
            >
              {tab.label}
              <span className="ml-2 opacity-70">({tab.count})</span>
            </button>
          ))}
        </div>
        <p className="ml-auto text-xs text-[var(--color-muted)]">
          <Globe size={12} className="mr-1 inline" />
          {counts.active} live on site · {counts.archived} archived
        </p>
      </div>

      {(showForm || editing) && (
        <div className="mb-10">
          <ProjectForm
            project={editing ?? undefined}
            onSaved={() => {
              setShowForm(false);
              setEditing(null);
              load();
            }}
            onCancel={() => {
              setShowForm(false);
              setEditing(null);
            }}
          />
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((p) => (
          <article
            key={p.id}
            className={`admin-card group overflow-hidden !p-0 transition ${
              !p.published ? "opacity-75" : ""
            }`}
          >
            <div className="relative h-36 bg-[var(--color-background)]">
              {p.imageUrl ? (
                <Image
                  src={p.imageUrl}
                  alt={p.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-[var(--color-muted)]">
                  No image
                </div>
              )}
              <div className="absolute left-3 top-3 flex flex-col gap-1">
                {p.featured && p.published && (
                  <span className="flex w-fit items-center gap-1 rounded-full bg-amber-500/90 px-2 py-0.5 text-xs font-medium text-black">
                    <Star size={12} fill="currentColor" />
                    Featured
                  </span>
                )}
                <StatusBadge published={p.published} />
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold leading-snug">{p.name}</h3>
              <p className="mt-1 line-clamp-2 text-xs text-[var(--color-muted)]">
                {p.description}
              </p>
              <p className="mt-2 text-xs text-[var(--color-muted)]">
                Order {p.sortOrder}
              </p>
              <div className="mt-4 flex flex-col gap-2">
                <button
                  type="button"
                  disabled={togglingId === p.id}
                  onClick={() => toggleVisibility(p)}
                  className={`flex w-full items-center justify-center gap-2 rounded-lg border py-2 text-xs font-medium transition ${
                    p.published
                      ? "border-zinc-500/40 text-zinc-400 hover:bg-zinc-500/10"
                      : "border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10"
                  }`}
                >
                  {p.published ? (
                    <>
                      <Archive size={14} />
                      Archive
                    </>
                  ) : (
                    <>
                      <Globe size={14} />
                      Make active
                    </>
                  )}
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(p);
                      setShowForm(true);
                    }}
                    className="btn-secondary flex-1 !py-2 !text-xs"
                  >
                    <Pencil size={14} />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(p.id)}
                    className="rounded-lg border border-red-500/30 px-3 py-2 text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {filtered.length === 0 && !showForm && (
        <p className="py-16 text-center text-[var(--color-muted)]">
          {filter === "archived"
            ? "No archived projects."
            : filter === "active"
              ? "No active projects — create one or activate an archived project."
              : "No projects yet."}
        </p>
      )}
    </AdminShell>
  );
}
