/** Rotating hero titles — first item is shown on load (index 0). */
export const DEFAULT_HERO_ROLES = [
  "Mobile App Developer",
  "AI Engineer",
  "AI Automation Specialist",
  "ML Engineer",
  "Full Stack Developer",
  "Next.js Developer",
  "React Engineer",
  "Node.js Backend Developer",
  "Python Engineer",
  "Software Engineer",
] as const;

export const DEFAULT_HERO_ROLES_CSV = DEFAULT_HERO_ROLES.join(",");

export function parseHeroRoles(raw: string | null | undefined): string[] {
  const parsed = (raw ?? DEFAULT_HERO_ROLES_CSV)
    .split(",")
    .map((r) => r.trim())
    .filter(Boolean);
  return parsed.length > 0 ? parsed : [...DEFAULT_HERO_ROLES];
}
