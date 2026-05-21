"use client";

import { useState } from "react";
import { ANALYTICS_EVENTS } from "@/lib/analytics-events";
import { trackEvent } from "@/lib/track-client";
import SectionHeading from "@/components/ui/SectionHeading";
import type { profile } from "@/drizzle/schema";
import type { projects } from "@/drizzle/schema";
import ProjectCard from "./ProjectCard";

type Project = typeof projects.$inferSelect;
type Profile = typeof profile.$inferSelect;

export default function Projects({
  projects: list,
  profile: p,
}: {
  projects: Project[];
  profile: Profile | null;
}) {
  const [visible, setVisible] = useState(6);
  return (
    <section id="projects" className="section-pad relative">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Portfolio"
          title=""
          highlight={p?.projectsHeading ?? "Selected Work"}
          description="Production apps, client work, and open-source contributions."
        />

        <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {list.slice(0, visible).map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>

        {list.length > visible && (
          <div className="mt-14 text-center">
            <button
              type="button"
              onClick={() => {
                trackEvent(ANALYTICS_EVENTS.PROJECTS_LOAD_MORE, {
                  meta: { visibleAfter: visible + 6, total: list.length },
                });
                setVisible((v) => v + 6);
              }}
              className="btn-secondary"
            >
              Load more projects
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
