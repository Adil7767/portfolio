"use client";

import { Archive, Globe } from "lucide-react";
import { fromVisibility, type VisibilityStatus } from "@/lib/visibility";

export default function VisibilityControl({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (published: boolean) => void;
}) {
  const status: VisibilityStatus = value ? "active" : "archived";

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-[var(--color-muted)]">Visibility on public site</p>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onChange(fromVisibility("active"))}
          className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition ${
            status === "active"
              ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-400"
              : "border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-border-strong)]"
          }`}
        >
          <Globe size={16} />
          Active
        </button>
        <button
          type="button"
          onClick={() => onChange(fromVisibility("archived"))}
          className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition ${
            status === "archived"
              ? "border-zinc-500/50 bg-zinc-500/15 text-zinc-400"
              : "border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-border-strong)]"
          }`}
        >
          <Archive size={16} />
          Archived
        </button>
      </div>
      <p className="text-xs text-[var(--color-muted)]">
        {status === "active"
          ? "This project appears on your public portfolio."
          : "Archived projects stay in admin but are hidden from visitors."}
      </p>
    </div>
  );
}
