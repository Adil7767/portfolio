"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import OptimizedImage from "@/components/ui/OptimizedImage";
import type { projects } from "@/drizzle/schema";

type Project = typeof projects.$inferSelect;

export default function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const tags = project.tags?.split(",").filter(Boolean) ?? [];

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="card-premium group flex flex-col overflow-hidden rounded-2xl"
    >
      <div className="relative h-56 overflow-hidden bg-[var(--color-surface-elevated)]">
        {project.imageUrl ? (
          <OptimizedImage
            src={project.imageUrl}
            alt={project.name}
            fill
            width={600}
            height={400}
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-[var(--color-muted)]">
            No preview
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface)] to-transparent opacity-80" />
        {project.featured && (
          <span className="absolute left-4 top-4 rounded-full bg-[var(--color-accent)] px-3 py-1 text-xs font-semibold text-white">
            Featured
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-xl font-semibold leading-snug">{project.name}</h3>
          {project.link && project.link !== "#" && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 rounded-lg border border-[var(--color-border)] p-2 text-[var(--color-muted)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent-soft)]"
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

        <p
          className={`mt-4 flex-1 text-sm leading-relaxed text-[var(--color-muted)] ${expanded ? "" : "line-clamp-3"}`}
        >
          {project.description}
        </p>

        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[var(--color-accent-soft)]"
        >
          {expanded ? "Show less" : "Read more"}
          <ChevronDown size={16} className={`transition ${expanded ? "rotate-180" : ""}`} />
        </button>
      </div>
    </motion.article>
  );
}
