import { asc, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { resolveProjectImageUrl } from "@/lib/project-covers";
import { resolveSkillIconUrl } from "@/lib/tech-icons";
import {
  contactMessages,
  profile,
  projects,
  services,
  skills,
  socialLinks,
} from "@/drizzle/schema";

export async function getProfile() {
  const rows = await db.select().from(profile).limit(1);
  return rows[0] ?? null;
}

function withProjectCovers<T extends { name: string; imageUrl: string | null }>(rows: T[]) {
  return rows.map((row) => ({
    ...row,
    imageUrl: resolveProjectImageUrl(row.name, row.imageUrl),
  }));
}

export async function getPublishedProjects() {
  const rows = await db
    .select()
    .from(projects)
    .where(eq(projects.published, true))
    .orderBy(desc(projects.featured), asc(projects.sortOrder), desc(projects.id));
  return withProjectCovers(rows);
}

export async function getPublishedProjectById(id: number) {
  const rows = await db
    .select()
    .from(projects)
    .where(eq(projects.id, id))
    .limit(1);
  const row = rows[0];
  if (!row?.published) return null;
  return withProjectCovers([row])[0];
}

export async function getAllProjects() {
  const rows = await db
    .select()
    .from(projects)
    .orderBy(asc(projects.sortOrder), desc(projects.id));
  return withProjectCovers(rows);
}

export async function getPublishedServices() {
  return db
    .select()
    .from(services)
    .where(eq(services.published, true))
    .orderBy(asc(services.sortOrder));
}

export async function getPublishedSkills() {
  const rows = await db
    .select()
    .from(skills)
    .where(eq(skills.published, true))
    .orderBy(asc(skills.sortOrder));
  return rows.map((row) => ({
    ...row,
    iconUrl: resolveSkillIconUrl(row.name, row.iconUrl),
  }));
}

export async function getPublishedSocialLinks() {
  return db
    .select()
    .from(socialLinks)
    .where(eq(socialLinks.published, true))
    .orderBy(asc(socialLinks.sortOrder));
}

export async function getContactMessages() {
  return db
    .select()
    .from(contactMessages)
    .orderBy(desc(contactMessages.createdAt));
}

export async function getPortfolioData() {
  const [profileData, projectsData, servicesData, skillsData, linksData] =
    await Promise.all([
      getProfile(),
      getPublishedProjects(),
      getPublishedServices(),
      getPublishedSkills(),
      getPublishedSocialLinks(),
    ]);

  return {
    profile: profileData,
    projects: projectsData,
    services: servicesData,
    skills: skillsData,
    socialLinks: linksData,
  };
}
