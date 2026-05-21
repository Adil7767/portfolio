/** Portfolio project catalog — used by seed.ts */

import { projectCoverByName, defaultProjectCover } from "../lib/project-covers";

export type ProjectSeed = {
  name: string;
  description: string;
  link: string;
  imageUrl: string;
  tags: string;
  featured: boolean;
};

const gh = (repo: string) =>
  `https://opengraph.githubassets.com/1/Adil7767/${repo}`;

const favicon = (domain: string) =>
  `https://www.google.com/s2/favicons?domain=${domain}&sz=256`;

const cover = (name: string) => projectCoverByName[name] ?? defaultProjectCover;

export const projectsCatalog: ProjectSeed[] = [
  // —— Featured / lead products ——
  {
    name: "360 Living",
    description:
      "Property and school housing platform with admin and school portals. Built school/apartment workflows, leases, financial reporting, API-first architecture, OTP auth, and production stability fixes on Prisma/Express APIs.",
    link: "https://app.360living.ae",
    imageUrl: cover("360 Living"),
    tags: "Next.js,React,Node.js,Express,Prisma,PostgreSQL,Ant Design",
    featured: true,
  },
  {
    name: "BridgeBond",
    description:
      "Multi-tenant enterprise platform with organization hierarchy, RBAC, OTP auth, and AI-assisted workflows. Multiple React/Vite frontends (admin, user, super-admin) on a shared Express/MongoDB core with Stripe, OpenAI, Pinecone, and S3.",
    link: "https://user.bridgebond.ai",
    imageUrl: cover("BridgeBond"),
    tags: "Node.js,Express,MongoDB,React,Vite,Stripe,OpenAI",
    featured: true,
  },
  {
    name: "Digital Dehari",
    description:
      "Full-stack agricultural / marketplace product with dedicated web and mobile codebases. Lead development across TypeScript web and React Native mobile apps with active production delivery.",
    link: "https://github.com/Adil7767/digital-dehari-web",
    imageUrl: cover("Digital Dehari"),
    tags: "Next.js,React Native,TypeScript,Node.js",
    featured: true,
  },
  {
    name: "Babu ISP",
    description:
      "Multi-tenant ISP SaaS with Next.js web, Prisma, Supabase, Expo mobile app, and Playwright E2E tests. Web API is the single DB-touching layer; mobile consumes APIs without direct database coupling.",
    link: "https://babu-isp.vercel.app",
    imageUrl: cover("Babu ISP"),
    tags: "Next.js,Prisma,Supabase,Expo,React Native,Playwright",
    featured: true,
  },
  {
    name: "AgriMarket Connect (ATI)",
    description:
      "Agricultural marketplace and multi-admin ecosystem. NestJS + Prisma + PostgreSQL backend serving marketplace, admin, and retail surfaces with WebSockets and role-aware React/Vite frontends.",
    link: "https://github.com/Adil7767",
    imageUrl: cover("AgriMarket Connect (ATI)"),
    tags: "NestJS,Prisma,PostgreSQL,Vite,React,WebSockets",
    featured: true,
  },
  {
    name: "Oono — AI Stories Platform",
    description:
      "Interactive AI stories for lead generation and conversion. Web admin, web viewer, Node.js backend, and React Native mobile app for content delivery and engagement.",
    link: "https://oono.ai",
    imageUrl: cover("Oono — AI Stories Platform"),
    tags: "React Native,Next.js,Node.js,AI",
    featured: true,
  },
  {
    name: "Enigmatix OMS",
    description:
      "Office management platform for HR, payroll, attendance, punch in/out, expenses, projects, and employee profiles. Web and mobile punch-in experiences for workforce operations.",
    link: "https://oms.enigmatix.co/login",
    imageUrl: favicon("enigmatix.co"),
    tags: "React,React Native,Node.js",
    featured: true,
  },
  {
    name: "EasyStream",
    description:
      "Multi-platform live streaming solution with Expo/React Native clients, Express/MongoDB backend, Socket.io, Livepeer integration, and PM2/nginx deployment workflows.",
    link: "https://github.com/Adil7767",
    imageUrl: gh("EasyStream"),
    tags: "Expo,React Native,Express,MongoDB,Socket.io,Livepeer",
    featured: true,
  },
  {
    name: "Orum Training (Maxim Fitness)",
    description:
      "All-in-one fitness platform: personalized coaching programs, diet tracking, exercise plans, and social features. Delivered mobile and web experiences for Enigmatix/Orum Training.",
    link: "https://orumtraining.com",
    imageUrl:
      "https://play-lh.googleusercontent.com/HNLJqAcHSE_Ufl_e2IlMmCtV6OVGw17J1yspFDdA3lSIIUYsy4Y6hjdJJrmjdtZv0Po",
    tags: "React Native,Next.js,Node.js",
    featured: true,
  },
  {
    name: "Freedoms AI",
    description:
      "AI journaling and productivity SaaS built with Next.js, Supabase, Stripe billing, and Radix UI for a polished product experience.",
    link: "https://github.com/Adil7767",
    imageUrl: gh("Freedoms-AI"),
    tags: "Next.js,Supabase,Stripe,AI",
    featured: true,
  },

  // —— Additional production & catalog ——
  {
    name: "ArbShark",
    description:
      "Sports arbitrage platform with Express, Prisma, Supabase, and Vite/React frontend for odds analysis workflows.",
    link: "https://github.com/Adil7767",
    imageUrl: gh("ArbShark"),
    tags: "Express,Prisma,Supabase,Vite,React",
    featured: false,
  },
  {
    name: "Sayber Healthcare",
    description:
      "Healthcare/FHIR-oriented backend system using TypeScript, Express, Drizzle ORM, and PostgreSQL.",
    link: "https://github.com/Adil7767",
    imageUrl: gh("Sayber"),
    tags: "TypeScript,Express,Drizzle,PostgreSQL,FHIR",
    featured: false,
  },
  {
    name: "Tennis Trainer",
    description:
      "Video analysis API with Flask, Docker, Redis, and Expo mobile client for training insights.",
    link: "https://github.com/Adil7767",
    imageUrl: gh("Tennis-Trainer"),
    tags: "Flask,Docker,Redis,Expo,Python",
    featured: false,
  },
  {
    name: "Hydra LAN Control",
    description:
      "LAN dashboard and control application using Next.js, SQLite, and Socket.io for local network management.",
    link: "https://github.com/Adil7767",
    imageUrl: gh("Hydra-LAN-Control"),
    tags: "Next.js,SQLite,Socket.io",
    featured: false,
  },
  {
    name: "Headless Commerce (Medusa)",
    description:
      "Medusa.js headless commerce backend with Next.js storefront and Stripe/PayPal payment flows.",
    link: "https://github.com/Adil7767",
    imageUrl:
      "https://user-images.githubusercontent.com/59018053/229103726-e5b529a3-9b3f-4970-8a1f-c6af37f087bf.svg",
    tags: "Medusa,Next.js,PostgreSQL,Stripe",
    featured: false,
  },
  {
    name: "Fruitful Hickory",
    description:
      "Expo mobile app with maps, Drizzle ORM, Supabase, and Mapbox for location-aware workflows.",
    link: "https://github.com/Adil7767",
    imageUrl: gh("Fruitful-Hickory"),
    tags: "Expo,Drizzle,Supabase,Mapbox",
    featured: false,
  },
  {
    name: "Barbershop Level Up",
    description:
      "Salon management web application with Next.js, NextAuth, and MongoDB for bookings and operations.",
    link: "https://github.com/Adil7767",
    imageUrl: gh("Barbershop-Level-Up"),
    tags: "Next.js,NextAuth,MongoDB",
    featured: false,
  },
  {
    name: "Workli",
    description:
      "Expo application with maps, notifications, and Supabase backend for field workflows.",
    link: "https://github.com/Adil7767",
    imageUrl: gh("Workli"),
    tags: "Expo,Supabase,Maps",
    featured: false,
  },
  {
    name: "LabelMates",
    description:
      "Retail and scanning-oriented SPA using Vite, React, TypeScript, and Supabase.",
    link: "https://github.com/Adil7767",
    imageUrl: gh("LabelMates"),
    tags: "Vite,React,TypeScript,Supabase",
    featured: false,
  },
  {
    name: "GetIn Scanner",
    description:
      "Scanner mobile app with Flutter frontend and Express/Prisma TypeScript backend.",
    link: "https://github.com/Adil7767",
    imageUrl: gh("GetIn-Scanner"),
    tags: "Flutter,Express,Prisma",
    featured: false,
  },
  {
    name: "OMS Punch In (Enigmatix)",
    description:
      "Mobile and web punch-in/out apps for attendance and work-hour management at Enigmatix.",
    link: "https://play.google.com/store/apps/details?id=com.enigmatix.punchinout",
    imageUrl:
      "https://play-lh.googleusercontent.com/HNLJqAcHSE_Ufl_e2IlMmCtV6OVGw17J1yspFDdA3lSIIUYsy4Y6hjdJJrmjdtZv0Po",
    tags: "React Native,React,Node.js",
    featured: false,
  },
  {
    name: "FinArt Internship",
    description:
      "Contributed to FinArt's React Native digital platform, improving UX and art appraisal workflows during internship.",
    link: "https://github.com/Adil7767/Financial_App_React_Native",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaujQhRBSNGH3_lSb69m9A-4CjmifEUt2K2Q&s",
    tags: "React Native,JavaScript",
    featured: false,
  },
  {
    name: "Shutterlift (Fusionwave)",
    description:
      "Dynamic Next.js gallery application with Node.js backend for Fusionwave client delivery.",
    link: "https://github.com/UmarAsif737/gallery-maker",
    imageUrl: gh("gallery-maker"),
    tags: "Next.js,Node.js",
    featured: false,
  },
  {
    name: "Rentaround",
    description:
      "Cross-platform React Native vehicle rental app with intuitive booking flows.",
    link: "https://play.google.com/store/apps/details?id=com.rentaround",
    imageUrl: favicon("play.google.com"),
    tags: "React Native",
    featured: false,
  },
  {
    name: "Expense Management (MERN)",
    description:
      "Web expense tracker with MERN stack for daily spending visibility and categorization.",
    link: "https://github.com/Priyanshu9898/Expense-Tracker-App",
    imageUrl: gh("Expense-Tracker-App"),
    tags: "MongoDB,Express,React,Node.js",
    featured: false,
  },
  {
    name: "Overtime Marketplace",
    description:
      "Freelance services platform connecting clients and providers, similar to Upwork/Fiverr models.",
    link: "https://play.google.com/store/apps/details?id=com.MRcode.overtime_app",
    imageUrl: favicon("play.google.com"),
    tags: "React Native,Node.js",
    featured: false,
  },
  {
    name: "react-native-instagram-stories",
    description:
      "Open-source contribution to Birdwingo's Instagram-style stories component for React Native apps.",
    link: "https://github.com/birdwingo/react-native-instagram-stories",
    imageUrl:
      "https://miro.medium.com/v2/resize:fit:720/format:webp/1*i6ppi4kfJGgTjLoQo2Z51A.jpeg",
    tags: "React Native,Open Source",
    featured: false,
  },
  {
    name: "E-commerce (Next.js + Logto + Medusa)",
    description:
      "Full-featured storefront with Next.js, PostgreSQL, Logto auth, and Medusa headless commerce.",
    link: "https://github.com/Adil7767",
    imageUrl:
      "https://raw.githubusercontent.com/medusajs/medusa/master/www/apps/docs/public/medusa-logo.svg",
    tags: "Next.js,Medusa,Logto,PostgreSQL",
    featured: false,
  },
  {
    name: "Survey Management System",
    description:
      "Survey design, distribution, and analytics platform with multiple question types and reporting.",
    link: "https://github.com/Adil7767",
    imageUrl: gh("survey-system"),
    tags: "Next.js,PostgreSQL",
    featured: false,
  },
  {
    name: "Voting System",
    description:
      "Secure cross-platform voting with React Native, Next.js web, and PostgreSQL backend with live results.",
    link: "https://github.com/Adil7767",
    imageUrl: gh("voting-system"),
    tags: "React Native,Next.js,PostgreSQL",
    featured: false,
  },
  {
    name: "Mode Checker App (MCA)",
    description:
      "Final-year project: mood analysis using vitals, quizzes, image/text processing with React Native, Node.js, and Python.",
    link: "https://github.com/Adil7767/MCA",
    imageUrl: gh("MCA"),
    tags: "React Native,Node.js,Python",
    featured: false,
  },
  {
    name: "Backblaze Video Backend",
    description:
      "Video and rushes pipeline backend with Express, Backblaze B2, and FFmpeg processing.",
    link: "https://github.com/Adil7767",
    imageUrl: gh("Backblaze-Backend"),
    tags: "Express,FFmpeg,Backblaze",
    featured: false,
  },
  {
    name: "Atlas / Atlas Employee",
    description:
      "Dual React Native workforce apps with Firebase and Notifee push notification flows.",
    link: "https://github.com/Adil7767",
    imageUrl: gh("Atlas"),
    tags: "React Native,Firebase",
    featured: false,
  },
  {
    name: "Next.js Boilerplate",
    description:
      "Opinionated starter with Next.js, TypeScript, shadcn/ui, and Tailwind for fast product bootstrapping.",
    link: "https://github.com/adil77672/nextjs-starter",
    imageUrl: gh("nextjs-starter"),
    tags: "Next.js,TypeScript,shadcn,Tailwind",
    featured: false,
  },
];
