import { toVisibility, visibilityLabels } from "@/lib/visibility";

export default function StatusBadge({ published }: { published: boolean }) {
  const status = toVisibility(published);
  const { label, color } = visibilityLabels[status];

  const classes =
    color === "emerald"
      ? "bg-emerald-500/20 text-emerald-400 ring-emerald-500/30"
      : "bg-zinc-500/20 text-zinc-400 ring-zinc-500/30";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${classes}`}
    >
      {label}
    </span>
  );
}
