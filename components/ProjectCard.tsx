"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ANALYTICS_EVENTS } from "@/lib/analytics-events";
import { trackEvent } from "@/lib/track-client";
import { ArrowUpRight } from "lucide-react";
import ProjectCover from "@/components/ui/ProjectCover";
import type { projects } from "@/drizzle/schema";

type Project = typeof projects.$inferSelect;

export default function ProjectCard({ project, index }: { project: Project; index: number }) {
  const tags = project.tags?.split(",").filter(Boolean) ?? [];
  const detailHref = `/projects/${project.id}`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="card-premium group flex flex-col overflow-hidden rounded-2xl"
    >
      <Link href={detailHref} className="relative block h-56 overflow-hidden bg-[var(--color-surface-elevated)]">
        <ProjectCover name={project.name} imageUrl={project.imageUrl} />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface)] to-transparent opacity-80 transition group-hover:opacity-90" />
        {project.featured && (
          <span className="absolute left-4 top-4 rounded-full bg-[var(--color-accent)] px-3 py-1 text-xs font-semibold text-white">
            Featured
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-2">
          <Link href={detailHref} className="font-display text-xl font-semibold leading-snug hover:text-[var(--color-accent-soft)]">
            {project.name}
          </Link>
          {project.link && project.link !== "#" && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.stopPropagation();
                trackEvent(ANALYTICS_EVENTS.PROJECT_LINK_CLICK, {
                  entityId: project.id,
                  entityLabel: project.name,
                });
              }}
              className="shrink-0 rounded-lg border border-[var(--color-border)] p-2 text-[var(--color-muted)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent-soft)]"
              title="Open live site"
            >
              <ArrowUpRight size={18} />
            </a>
          )}
        </div>

        {tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-[var(--color-accent)]/10 px-2.5 py-0.5 text-xs font-medium text-[var(--color-accent-soft)]"
              >
                {tag.trim()}
              </span>
            ))}
          </div>
        )}

        <p className="mt-4 flex-1 line-clamp-3 text-sm leading-relaxed text-[var(--color-muted)]">
          {project.description}
        </p>

        <Link
          href={detailHref}
          className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[var(--color-accent-soft)] transition hover:gap-2"
        >
          View details
          <ArrowUpRight size={16} />
        </Link>
      </div>
    </motion.article>
  );
}
