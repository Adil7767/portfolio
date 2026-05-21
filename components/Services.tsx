"use client";

import { motion } from "framer-motion";
import {
  Cloud,
  Globe,
  Layers,
  Server,
  Smartphone,
  Sparkles,
} from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import type { profile } from "@/drizzle/schema";
import type { services } from "@/drizzle/schema";

type Service = typeof services.$inferSelect;
type Profile = typeof profile.$inferSelect;

const serviceIcons: Record<string, typeof Globe> = {
  "Web Application Development": Globe,
  "Mobile Application Development": Smartphone,
  "Backend & API Engineering": Server,
  "Backend Development": Server,
  "SaaS & Multi-tenant Systems": Layers,
  "Cloud & API Integrations": Cloud,
  "Cloud, DevOps & Integrations": Cloud,
  "SEO & Performance": Sparkles,
  "SEO & Performance Optimization": Sparkles,
  "UI/UX Design": Sparkles,
  "AI & Real-time Features": Sparkles,
};

export default function Services({
  services: list,
  profile: p,
}: {
  services: Service[];
  profile: Profile | null;
}) {
  return (
    <section
      id="services"
      className="section-pad relative border-y border-[var(--color-border)] bg-[var(--color-surface)]/50"
    >
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Services"
          title=""
          highlight={p?.servicesHeading ?? "What I Offer"}
          description="End-to-end product development — from UI to deployment."
        />

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list.map((service, i) => {
            const Icon = serviceIcons[service.name] ?? Globe;
            return (
              <motion.article
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="card-premium group rounded-2xl p-8 transition hover:-translate-y-1"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--color-accent)]/25 to-[var(--color-glow)]/15 text-[var(--color-accent-soft)]">
                  <Icon size={28} strokeWidth={1.75} />
                </div>
                <h3 className="font-display text-xl font-semibold">{service.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted)]">
                  {service.description}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
