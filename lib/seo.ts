import type { Metadata } from "next";
import type { profile } from "@/drizzle/schema";
import { absoluteUrl, getSiteUrl } from "@/lib/site-url";

type Profile = typeof profile.$inferSelect;

const FALLBACK_TITLE = "Adil Mustafa | Full Stack Developer";
const FALLBACK_DESCRIPTION =
  "Portfolio of Adil Mustafa — Full Stack Developer building web, mobile, and cloud-native products.";

export function buildPortfolioMetadata(p: Profile | null): Metadata {
  const title = p
    ? `${p.name} | ${p.headline.replace(/\s+/g, " ").trim()}`
    : FALLBACK_TITLE;
  const description =
    p?.tagline?.trim() ||
    p?.bio?.replace(/\s+/g, " ").trim().slice(0, 160) ||
    FALLBACK_DESCRIPTION;
  const imagePath = p?.heroImageUrl || p?.avatarUrl || "/mine.png";
  const imageUrl = absoluteUrl(imagePath);
  const siteUrl = getSiteUrl();

  return {
    title,
    description,
    alternates: { canonical: siteUrl },
    openGraph: {
      title,
      description,
      url: siteUrl,
      siteName: p?.name ?? "Portfolio",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: p?.name ?? "Portfolio preview",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    robots: { index: true, follow: true },
  };
}

export function buildProjectMetadata(
  project: { id: number; name: string; description: string; imageUrl: string | null },
  ownerName?: string | null
): Metadata {
  const title = `${project.name}${ownerName ? ` | ${ownerName}` : ""}`;
  const description = project.description.replace(/\s+/g, " ").trim().slice(0, 160);
  const imageUrl = project.imageUrl ? absoluteUrl(project.imageUrl) : undefined;

  return {
    title,
    description,
    openGraph: {
      title: project.name,
      description,
      type: "article",
      url: absoluteUrl(`/projects/${project.id}`),
      ...(imageUrl ? { images: [{ url: imageUrl, alt: project.name }] } : {}),
    },
    twitter: {
      card: imageUrl ? "summary_large_image" : "summary",
      title: project.name,
      description,
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },
  };
}
