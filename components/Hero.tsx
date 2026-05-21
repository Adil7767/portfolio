"use client";

import OptimizedImage from "@/components/ui/OptimizedImage";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Download, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import type { profile } from "@/drizzle/schema";
import type { socialLinks } from "@/drizzle/schema";

type Profile = typeof profile.$inferSelect;
type Social = typeof socialLinks.$inferSelect;

function RoleRotator({ roles }: { roles: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (roles.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % roles.length);
    }, 3200);
    return () => clearInterval(id);
  }, [roles.length]);

  return (
    <span className="gradient-text inline-block min-h-[1.2em]">
      {roles[index] ?? roles[0]}
    </span>
  );
}

export default function Hero({
  profile: p,
  socialLinks: links,
  projectCount = 0,
}: {
  profile: Profile | null;
  socialLinks: Social[];
  projectCount?: number;
}) {
  const roles = (p?.roles ?? "Full Stack Developer,Front End Engineer,Mobile Developer")
    .split(",")
    .map((r) => r.trim())
    .filter(Boolean);

  const avatar = p?.avatarUrl || "/avatar-crop.png";
  const heroImg = p?.heroImageUrl || p?.avatarUrl || "/avatar-crop.png";

  return (
    <section id="home" className="relative min-h-screen overflow-hidden mesh-bg noise-overlay pt-28 pb-24">
      <div className="relative mx-auto grid max-w-6xl items-center gap-16 px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="animate-fade-up relative z-10"
        >
          {p?.availabilityLabel && (
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] bg-[var(--color-surface)]/80 px-4 py-1.5 text-xs font-medium text-[var(--color-accent-soft)]">
              <Sparkles size={14} className="text-[var(--color-glow)]" />
              {p.availabilityLabel}
            </p>
          )}

          <h1 className="font-display text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.5rem]">
            Building digital products as{" "}
            <br className="hidden sm:block" />
            <RoleRotator roles={roles.length ? roles : ["Full Stack Developer"]} />
          </h1>

          <p className="mt-6 max-w-lg text-lg text-[var(--color-muted)]">
            Hi, I&apos;m{" "}
            <span className="font-semibold text-[var(--color-foreground)]">
              {p?.name ?? "Adil Mustafa"}
            </span>
            {p?.headline ? ` — ${p.headline}` : ""}
          </p>
          {p?.tagline && (
            <p className="mt-3 max-w-xl text-base leading-relaxed text-[var(--color-muted)]">
              {p.tagline}
            </p>
          )}

          <div className="mt-10 flex flex-wrap items-center gap-4">
            {p?.resumeUrl && (
              <a href="/resume" className="btn-primary">
                <Download size={18} />
                Download resume
              </a>
            )}
            <Link href="#projects" className="btn-secondary group">
              View projects
              <ArrowRight size={18} className="transition group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="mt-14 flex flex-wrap gap-8 border-t border-[var(--color-border)] pt-10">
            <div>
              <p className="font-display text-3xl font-bold">{projectCount}+</p>
              <p className="text-sm text-[var(--color-muted)]">Projects shipped</p>
            </div>
            <div>
              <p className="font-display text-3xl font-bold">{links.length}</p>
              <p className="text-sm text-[var(--color-muted)]">Social profiles</p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {links.map((el) => (
              <a
                key={el.id}
                href={el.url}
                target="_blank"
                rel="noopener noreferrer"
                title={el.name}
                className="card-premium rounded-xl p-2.5 transition hover:-translate-y-0.5"
              >
                {el.iconUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={el.iconUrl} alt={el.name} className="h-7 w-7" />
                ) : (
                  <span className="px-2 text-xs">{el.name}</span>
                )}
              </a>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="animate-fade-up relative mx-auto w-full max-w-md lg:max-w-none [animation-delay:120ms]"
        >
          <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-[var(--color-accent)]/30 via-transparent to-[var(--color-glow)]/20 blur-2xl" />
          <div className="card-premium relative aspect-[4/5] overflow-hidden rounded-[2rem]">
            <OptimizedImage
              src={heroImg}
              alt={p?.name ?? "Profile"}
              fill
              width={720}
              height={900}
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-background)] via-transparent to-transparent opacity-60" />
            <div className="absolute bottom-6 left-6 right-6">
              <p className="font-display text-xl font-bold">{p?.name}</p>
              <p className="text-sm text-[var(--color-muted)]">{p?.headline}</p>
            </div>
          </div>
          <div className="absolute -right-4 top-8 hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-2xl sm:block">
            <div className="relative h-16 w-16 overflow-hidden rounded-xl">
              <OptimizedImage src={avatar} alt="" fill width={128} height={128} className="object-cover" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
