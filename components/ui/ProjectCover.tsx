"use client";

import { useState } from "react";
import { resolveProjectImageUrl } from "@/lib/project-covers";

export default function ProjectCover({
  name,
  imageUrl,
}: {
  name: string;
  imageUrl: string | null;
}) {
  const [failed, setFailed] = useState(false);
  const src = resolveProjectImageUrl(name, imageUrl);

  if (failed || !src) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-[var(--color-accent)]/25 to-[var(--color-glow)]/10 p-6">
        <span className="font-display text-3xl font-bold text-[var(--color-accent-soft)]">
          {name.slice(0, 2).toUpperCase()}
        </span>
        <span className="text-center text-xs text-[var(--color-muted)]">{name}</span>
      </div>
    );
  }

  return (
    // Native img — avoids Next/Image blocking Unsplash or GitHub OG URLs
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  );
}
