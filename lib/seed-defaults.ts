import { count } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  profile,
  projects,
  services,
  skills,
  socialLinks,
} from "@/drizzle/schema";
import { projectsCatalog } from "@/scripts/projects-catalog";
import { DEFAULT_HERO_ROLES_CSV } from "@/lib/hero-roles";
import { skillIcons, serviceIcons } from "@/lib/tech-icons";

export const defaultServiceData = [
  {
    name: "Web Application Development",
    description:
      "Modern, responsive web apps with React, Next.js, and TypeScript — from MVP to production scale.",
    iconUrl: serviceIcons["Web Application Development"],
  },
  {
    name: "Mobile Application Development",
    description:
      "Cross-platform React Native & Expo apps with native performance and polished UX.",
    iconUrl: serviceIcons["Mobile Application Development"],
  },
  {
    name: "Backend & API Engineering",
    description:
      "Scalable APIs with Node.js, Express, NestJS, Prisma, and PostgreSQL/MongoDB.",
    iconUrl: serviceIcons["Backend & API Engineering"],
  },
  {
    name: "SaaS & Multi-tenant Systems",
    description:
      "Enterprise dashboards, RBAC, billing, and integration-heavy platforms like BridgeBond & 360 Living.",
    iconUrl: serviceIcons["SaaS & Multi-tenant Systems"],
  },
  {
    name: "Cloud, DevOps & Integrations",
    description:
      "AWS, Supabase, Cloudinary, Stripe, CI-friendly deployments, Docker, PM2, and nginx.",
    iconUrl: serviceIcons["Cloud, DevOps & Integrations"],
  },
  {
    name: "AI & Real-time Features",
    description:
      "OpenAI workflows, WebSockets, streaming, and product features that combine AI with solid UX.",
    iconUrl: serviceIcons["AI & Real-time Features"],
  },
];

export const defaultSocialData = [
  { name: "GitHub", url: "https://github.com/Adil7767", iconUrl: "https://img.icons8.com/doodle/40/000000/github--v1.png" },
  { name: "LinkedIn", url: "https://www.linkedin.com/in/adilmustafa7767", iconUrl: "https://img.icons8.com/doodle/40/000000/linkedin--v2.png" },
  {
    name: "Stack Overflow",
    url: "https://stackoverflow.com/users/20939438/adil-mustafa",
    iconUrl:
      "https://img.icons8.com/external-tal-revivo-color-tal-revivo/40/000000/external-stack-overflow-is-a-question-and-answer-site-for-professional-logo-color-tal-revivo.png",
  },
  { name: "Instagram", url: "https://www.instagram.com/adil77671", iconUrl: "https://img.icons8.com/doodle/40/000000/instagram-new--v2.png" },
];

export const defaultProfileData = {
  name: "Adil Mustafa",
  headline: "Full Stack Developer at Fusionwave Pvt Ltd",
  tagline:
    "I build production-ready web & mobile products — React Native, Next.js, Node.js, TypeScript.",
  bio: "I'm a self-taught full stack developer with experience shipping features from ideation to production. I specialize in turning wireframes and design flows into high-performance applications, with strong focus on user experience, reusable code, and scalable backends. Currently working at Fusionwave Pvt Ltd, Lahore, delivering client and product work across SaaS, mobile, and API platforms.",
  email: "dev.adil786@gmail.com",
  location: "Lahore, Punjab, Pakistan",
  resumeUrl:
    "https://drive.google.com/file/d/1JWgiA8-BY2N7NKYMROjB8EaVafZQjzVX/view?usp=sharing",
  avatarUrl: "/mine.png",
  heroImageUrl: "/mine.png",
  roles: DEFAULT_HERO_ROLES_CSV,
  availabilityLabel: "Open to collaborations & opportunities",
  servicesHeading: "What I Offer",
  projectsHeading: "Featured Work",
  contactHeading: "Let's build something",
};

/** Fills empty CMS tables only — safe when DB timed out during first load. */
export async function restoreDefaultContent() {
  const restored: string[] = [];

  const [[{ n: profileN }], [{ n: socialN }], [{ n: servicesN }], [{ n: skillsN }], [{ n: projectsN }]] =
    await Promise.all([
      db.select({ n: count() }).from(profile),
      db.select({ n: count() }).from(socialLinks),
      db.select({ n: count() }).from(services),
      db.select({ n: count() }).from(skills),
      db.select({ n: count() }).from(projects),
    ]);

  if (Number(profileN) === 0) {
    await db.insert(profile).values(defaultProfileData);
    restored.push("profile");
  }

  if (Number(socialN) === 0) {
    await db.insert(socialLinks).values(
      defaultSocialData.map((s, i) => ({ ...s, sortOrder: i, published: true }))
    );
    restored.push("social links");
  }

  if (Number(servicesN) === 0) {
    await db.insert(services).values(
      defaultServiceData.map((s, i) => ({ ...s, sortOrder: i, published: true }))
    );
    restored.push("services");
  }

  if (Number(skillsN) === 0) {
    await db.insert(skills).values(
      skillIcons.map((s, i) => ({ ...s, sortOrder: i, published: true }))
    );
    restored.push("skills");
  }

  if (Number(projectsN) === 0) {
    await db.insert(projects).values(
      projectsCatalog.map((p, i) => ({
        name: p.name,
        description: p.description,
        link: p.link,
        imageUrl: p.imageUrl,
        tags: p.tags,
        featured: p.featured,
        sortOrder: i,
        published: true,
      }))
    );
    restored.push("projects");
  }

  return { restored, message: restored.length ? `Restored: ${restored.join(", ")}` : "All tables already have data." };
}
