import type { MetadataRoute } from "next";
import { getPublishedProjects } from "@/lib/data";
import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const projects = await getPublishedProjects();

  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...projects.map((p) => ({
      url: `${base}/projects/${p.id}`,
      lastModified: p.updatedAt ?? new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
