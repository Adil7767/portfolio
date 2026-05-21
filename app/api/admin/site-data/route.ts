import { asc } from "drizzle-orm";
import { withAdminHandler } from "@/lib/admin-api";
import { db } from "@/lib/db";
import { profile, services, skills, socialLinks } from "@/drizzle/schema";
import { getProfile } from "@/lib/data";

export const runtime = "nodejs";
export const maxDuration = 30;

function toJson<T>(row: T): T {
  return JSON.parse(JSON.stringify(row)) as T;
}

/** Single request loads all site editor data (avoids 4 parallel admin API calls). */
export async function GET() {
  return withAdminHandler(async () => {
    const profileData = await getProfile();
    const social = await db
      .select()
      .from(socialLinks)
      .orderBy(asc(socialLinks.sortOrder));
    const servicesList = await db
      .select()
      .from(services)
      .orderBy(asc(services.sortOrder));
    const skillsList = await db
      .select()
      .from(skills)
      .orderBy(asc(skills.sortOrder));

    return {
      profile: profileData ? toJson(profileData) : null,
      socialLinks: toJson(social),
      services: toJson(servicesList),
      skills: toJson(skillsList),
    };
  });
}
