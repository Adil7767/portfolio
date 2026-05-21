import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../drizzle/schema";
import { DEFAULT_HERO_ROLES_CSV } from "@/lib/hero-roles";
import { projectsCatalog } from "./projects-catalog";
import { skillIcons, serviceIcons } from "../lib/tech-icons";

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
if (!connectionString) {
  console.error("Set DATABASE_URL or DIRECT_URL");
  process.exit(1);
}

const client = postgres(connectionString, { max: 1 });
const db = drizzle(client, { schema });

const serviceData = [
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

const socialData = [
  { name: "GitHub", url: "https://github.com/Adil7767", iconUrl: "https://img.icons8.com/doodle/40/000000/github--v1.png" },
  { name: "LinkedIn", url: "https://www.linkedin.com/in/adilmustafa7767", iconUrl: "https://img.icons8.com/doodle/40/000000/linkedin--v2.png" },
  { name: "Stack Overflow", url: "https://stackoverflow.com/users/20939438/adil-mustafa", iconUrl: "https://img.icons8.com/external-tal-revivo-color-tal-revivo/40/000000/external-stack-overflow-is-a-question-and-answer-site-for-professional-logo-color-tal-revivo.png" },
  { name: "Instagram", url: "https://www.instagram.com/adil77671", iconUrl: "https://img.icons8.com/doodle/40/000000/instagram-new--v2.png" },
];

async function seed() {
  console.log("Seeding database...");

  await db.delete(schema.contactMessages);
  await db.delete(schema.projects);
  await db.delete(schema.services);
  await db.delete(schema.skills);
  await db.delete(schema.socialLinks);
  await db.delete(schema.profile);

  await db.insert(schema.profile).values({
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
  });

  await db.insert(schema.projects).values(
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

  await db.insert(schema.services).values(
    serviceData.map((s, i) => ({ ...s, sortOrder: i, published: true }))
  );

  await db.insert(schema.skills).values(
    skillIcons.map((s, i) => ({ ...s, sortOrder: i, published: true }))
  );

  await db.insert(schema.socialLinks).values(
    socialData.map((s, i) => ({ ...s, sortOrder: i, published: true }))
  );

  console.log(`Seed complete — ${projectsCatalog.length} projects loaded.`);
  await client.end();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
