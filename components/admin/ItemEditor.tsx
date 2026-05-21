"use client";

import { useState } from "react";
import { Archive, Globe, Pencil, Plus, Trash2 } from "lucide-react";
import MediaUpload from "./MediaUpload";
import StatusBadge from "./StatusBadge";
import VisibilityControl from "./VisibilityControl";

export type ItemField = {
  key: string;
  label: string;
  type?: "text" | "textarea" | "url" | "number" | "checkbox" | "upload";
  placeholder?: string;
  uploadFolder?: "icons" | "services" | "misc";
};

export default function ItemEditor<T extends { id: number }>({
  title,
  description,
  apiPath,
  fields,
  emptyItem,
  items,
  onRefresh,
  withVisibility = false,
}: {
  title: string;
  description: string;
  apiPath: string;
  fields: ItemField[];
  emptyItem: Record<string, unknown>;
  items: T[];
  onRefresh: () => void;
  /** Enable Active / Archived controls (uses `published` field) */
  withVisibility?: boolean;
}) {
  const [editing, setEditing] = useState<T | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Record<string, unknown>>(emptyItem);
  const [loading, setLoading] = useState(false);

  function startEdit(item: T) {
    setEditing(item);
    setShowForm(false);
    const record = item as Record<string, unknown>;
    const next: Record<string, unknown> = {};
    fields.forEach((f) => {
      next[f.key] = record[f.key] ?? (f.type === "checkbox" ? false : "");
    });
    setForm(next);
  }

  function startNew() {
    setEditing(null);
    setShowForm(true);
    setForm({ ...emptyItem });
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const method = editing ? "PUT" : "POST";
    const body = editing ? { ...form, id: editing.id } : form;
    await fetch(apiPath, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setLoading(false);
    setShowForm(false);
    setEditing(null);
    onRefresh();
  }

  async function remove(id: number) {
    if (!confirm(`Delete this ${title.toLowerCase()}?`)) return;
    await fetch(`${apiPath}?id=${id}`, { method: "DELETE" });
    onRefresh();
  }

  async function toggleVisibility(item: T) {
    const record = item as Record<string, unknown>;
    const published = Boolean(record.published);
    await fetch(apiPath, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id, published: !published }),
    });
    onRefresh();
  }

  return (
    <div className="admin-card">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="mt-1 text-sm text-[var(--color-muted)]">{description}</p>
        </div>
        <button type="button" onClick={startNew} className="btn-primary shrink-0 !py-2 !text-xs">
          <Plus size={16} />
          Add
        </button>
      </div>

      {(showForm || editing) && (
        <form onSubmit={save} className="mb-6 space-y-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-4">
          {withVisibility && (
            <VisibilityControl
              value={Boolean(form.published)}
              onChange={(published) => setForm({ ...form, published })}
            />
          )}
          {fields
            .filter((f) => !(withVisibility && f.key === "published"))
            .map((field) => (
            <div key={field.key}>
              <label className="mb-1 block text-xs font-medium text-[var(--color-muted)]">
                {field.label}
              </label>
              {field.type === "textarea" ? (
                <textarea
                  rows={3}
                  value={String(form[field.key] ?? "")}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  className="input-field"
                  placeholder={field.placeholder}
                />
              ) : field.type === "checkbox" ? (
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={Boolean(form[field.key])}
                    onChange={(e) =>
                      setForm({ ...form, [field.key]: e.target.checked })
                    }
                  />
                  Published
                </label>
              ) : field.type === "upload" ? (
                <MediaUpload
                  label=""
                  value={String(form[field.key] ?? "")}
                  onChange={(url) => setForm({ ...form, [field.key]: url })}
                  folder={field.uploadFolder ?? "icons"}
                  aspect="square"
                  preview="image"
                />
              ) : (
                <input
                  type={field.type === "number" ? "number" : "text"}
                  value={String(form[field.key] ?? "")}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      [field.key]:
                        field.type === "number"
                          ? Number(e.target.value)
                          : e.target.value,
                    })
                  }
                  className="input-field"
                  placeholder={field.placeholder}
                />
              )}
            </div>
          ))}
          <div className="flex gap-2 pt-2">
            <button type="submit" disabled={loading} className="btn-primary !py-2 !text-xs">
              {loading ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditing(null);
              }}
              className="btn-secondary !py-2 !text-xs"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            className={`flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[var(--color-border)] px-4 py-3 ${
              withVisibility && !(item as Record<string, unknown>).published
                ? "opacity-70"
                : ""
            }`}
          >
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <span className="truncate text-sm font-medium">
                {(item as Record<string, unknown>).name as string}
              </span>
              {withVisibility && (
                <StatusBadge
                  published={Boolean((item as Record<string, unknown>).published)}
                />
              )}
            </div>
            <div className="flex gap-1">
              {withVisibility && (
                <button
                  type="button"
                  title={
                    (item as Record<string, unknown>).published
                      ? "Archive"
                      : "Make active"
                  }
                  onClick={() => toggleVisibility(item)}
                  className="rounded-lg p-2 text-[var(--color-muted)] hover:bg-[var(--color-surface-elevated)]"
                >
                  {(item as Record<string, unknown>).published ? (
                    <Archive size={16} />
                  ) : (
                    <Globe size={16} />
                  )}
                </button>
              )}
              <button
                type="button"
                onClick={() => startEdit(item)}
                className="rounded-lg p-2 text-[var(--color-muted)] hover:bg-[var(--color-surface-elevated)]"
              >
                <Pencil size={16} />
              </button>
              <button
                type="button"
                onClick={() => remove(item.id)}
                className="rounded-lg p-2 text-red-400 hover:bg-red-500/10"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </li>
        ))}
        {items.length === 0 && (
          <p className="py-4 text-center text-sm text-[var(--color-muted)]">No items yet.</p>
        )}
      </ul>
    </div>
  );
}
