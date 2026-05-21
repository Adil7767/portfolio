"use client";

import { useState } from "react";
import { resolveSkillIconUrl } from "@/lib/tech-icons";

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
  const src = resolveSkillIconUrl(name, iconUrl);

  if (failed || !src) {
    return (
      <div
        className="flex shrink-0 items-center justify-center rounded-lg bg-[var(--color-accent)]/20 font-display text-sm font-bold text-[var(--color-accent-soft)]"
        style={{ width: size, height: size }}
        title={name}
        aria-hidden
      >
        {name.slice(0, 2).toUpperCase()}
      </div>
    );
  }

  return (
    <div
      className="flex shrink-0 items-center justify-center"
      style={{ width: size, height: size }}
      title={name}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        width={size}
        height={size}
        className="max-h-full max-w-full object-contain"
        referrerPolicy="no-referrer"
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
