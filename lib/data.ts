import { asc, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
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

export async function getPublishedProjects() {
  return db
    .select()
    .from(projects)
    .where(eq(projects.published, true))
    .orderBy(desc(projects.featured), asc(projects.sortOrder), desc(projects.id));
}

export async function getAllProjects() {
  return db
    .select()
    .from(projects)
    .orderBy(asc(projects.sortOrder), desc(projects.id));
}

export async function getPublishedServices() {
  return db
    .select()
    .from(services)
    .where(eq(services.published, true))
    .orderBy(asc(services.sortOrder));
}

export async function getPublishedSkills() {
  return db
    .select()
    .from(skills)
    .where(eq(skills.published, true))
    .orderBy(asc(skills.sortOrder));
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
