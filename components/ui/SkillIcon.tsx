"use client";

import { useState } from "react";

export default function SkillIcon({
  name,
  iconUrl,
  size = 40,
}: {
  name: string;
  iconUrl: string;
  size?: number;
}) {
  const [failed, setFailed] = useState(false);

  if (failed || !iconUrl) {
    return (
      <div
        className="flex shrink-0 items-center justify-center rounded-lg bg-[var(--color-accent)]/20 font-display text-sm font-bold text-[var(--color-accent-soft)]"
        style={{ width: size, height: size }}
        aria-hidden
      >
        {name.slice(0, 2).toUpperCase()}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={iconUrl}
      alt={name}
      width={size}
      height={size}
      className="shrink-0 object-contain"
      onError={() => setFailed(true)}
    />
  );
}
