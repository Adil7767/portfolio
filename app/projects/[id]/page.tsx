import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, ExternalLink } from "lucide-react";
import Navbar from "@/components/Navbar";
import ProjectCover from "@/components/ui/ProjectCover";
import ProjectDetailTracker from "@/components/ProjectDetailTracker";
import { getProfile, getPublishedProjectById } from "@/lib/data";
import { buildProjectMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const [project, profile] = await Promise.all([
    getPublishedProjectById(Number(id)),
    getProfile(),
  ]);
  if (!project) return { title: "Project not found" };

  return buildProjectMetadata(project, profile?.name);
}

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params;
  const projectId = Number(id);
  if (!Number.isFinite(projectId) || projectId < 1) notFound();

  const [project, profile] = await Promise.all([
    getPublishedProjectById(projectId),
    getProfile(),
  ]);

  if (!project) notFound();

  const tags = project.tags?.split(",").filter(Boolean) ?? [];
  const hasLiveLink = project.link && project.link !== "#";

  return (
    <div className="mesh-bg min-h-screen">
      <ProjectDetailTracker projectId={project.id} projectName={project.name} />
      <Navbar name={profile?.name ?? "Adil Mustafa"} />

      <main className="mx-auto max-w-4xl px-6 pb-24 pt-28">
        <Link
          href="/#projects"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[var(--color-muted)] transition hover:text-[var(--color-foreground)]"
        >
          <ArrowLeft size={18} />
          Back to projects
        </Link>

        <article className="card-premium overflow-hidden rounded-3xl">
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-[var(--color-surface-elevated)] sm:aspect-[21/9]">
            <ProjectCover name={project.name} imageUrl={project.imageUrl} />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface)] via-transparent to-transparent" />
            {project.featured && (
              <span className="absolute left-6 top-6 rounded-full bg-[var(--color-accent)] px-4 py-1.5 text-xs font-semibold text-white">
                Featured project
              </span>
            )}
          </div>

          <div className="p-8 sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent-soft)]">
              Case study
            </p>
            <h1 className="font-display mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              {project.name}
            </h1>

            {tags.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-[var(--color-accent)]/10 px-3 py-1 text-sm font-medium text-[var(--color-accent-soft)]"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-8 space-y-4 text-base leading-relaxed text-[var(--color-muted)]">
              {project.description.split(/\n\n+/).map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              {hasLiveLink && (
                <a
                  href={project.link!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  <ExternalLink size={18} />
                  Visit live project
                </a>
              )}
              <Link href="/#contact" className="btn-secondary">
                Discuss this project
                <ArrowUpRight size={18} />
              </Link>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}
