"use client";

import { useState } from "react";
import Image from "next/image";
import MediaUpload from "./MediaUpload";
import VisibilityControl from "./VisibilityControl";

const empty = {
  name: "",
  description: "",
  link: "",
  imageUrl: "",
  tags: "",
  featured: false,
  published: true,
  sortOrder: 0,
};

type Project = {
  id: number;
  name: string;
  description: string;
  link: string | null;
  imageUrl: string | null;
  tags: string | null;
  featured: boolean;
  published: boolean;
  sortOrder: number;
};

export default function ProjectForm({
  project,
  onSaved,
  onCancel,
}: {
  project?: Project;
  onSaved: () => void;
  onCancel?: () => void;
}) {
  const [form, setForm] = useState(
    project
      ? {
          name: project.name,
          description: project.description,
          link: project.link ?? "",
          imageUrl: project.imageUrl ?? "",
          tags: project.tags ?? "",
          featured: project.featured,
          published: project.published,
          sortOrder: project.sortOrder,
        }
      : empty
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const method = project ? "PUT" : "POST";
    const body = project ? { ...form, id: project.id } : form;
    const res = await fetch("/api/admin/projects", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setLoading(false);
    if (!res.ok) {
      setError("Failed to save project");
      return;
    }
    onSaved();
  }

  return (
    <form onSubmit={handleSubmit} className="admin-card space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--color-border)] pb-4">
        <h3 className="font-display text-lg font-semibold">
          {project ? "Edit project" : "New project"}
        </h3>
        {project && (
          <span className="rounded-full bg-[var(--color-accent)]/15 px-3 py-1 text-xs text-[var(--color-accent-soft)]">
            ID #{project.id}
          </span>
        )}
      </div>

      <VisibilityControl
        value={form.published}
        onChange={(published) => setForm({ ...form, published })}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <input
            placeholder="Project name *"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="input-field"
          />
          <textarea
            placeholder="Description *"
            required
            rows={5}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="input-field resize-none"
          />
          <input
            placeholder="Live demo or repo URL"
            value={form.link}
            onChange={(e) => setForm({ ...form, link: e.target.value })}
            className="input-field"
          />
          <input
            placeholder="Tags — React, Next.js, TypeScript"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            className="input-field"
          />
          <div className="flex flex-wrap gap-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-4 text-sm">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="accent-[var(--color-accent)]"
              />
              Featured on portfolio
            </label>
            <label className="flex items-center gap-2">
              Display order
              <input
                type="number"
                value={form.sortOrder}
                onChange={(e) =>
                  setForm({ ...form, sortOrder: Number(e.target.value) })
                }
                className="input-field !w-16 !py-1"
              />
            </label>
          </div>
        </div>

        <MediaUpload
          label="Project cover image"
          hint="Upload screenshot — stored in Cloudinary"
          value={form.imageUrl}
          onChange={(url) => setForm({ ...form, imageUrl: url })}
          folder="projects"
          aspect="video"
        />
      </div>

      {form.imageUrl && (
        <div className="relative h-40 overflow-hidden rounded-xl border border-[var(--color-border)]">
          <Image src={form.imageUrl} alt="Preview" fill className="object-cover" unoptimized />
        </div>
      )}

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex gap-3 border-t border-[var(--color-border)] pt-4">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Saving…" : project ? "Update project" : "Create project"}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
