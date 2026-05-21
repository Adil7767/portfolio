"use client";

import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import SkillIcon from "@/components/ui/SkillIcon";
import type { profile } from "@/drizzle/schema";
import type { skills } from "@/drizzle/schema";

type Profile = typeof profile.$inferSelect;
type Skill = typeof skills.$inferSelect;

export default function About({
  profile: p,
  skills: skillList,
}: {
  profile: Profile | null;
  skills: Skill[];
}) {
  return (
    <section id="about" className="section-pad relative">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="About"
          title="Crafting"
          highlight="experiences"
          description={p?.bio ?? undefined}
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <p className="mb-8 text-center text-sm font-medium text-[var(--color-muted)]">
            Stack & tools I work with
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {skillList.map((skill, i) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.02 }}
                className="card-premium group flex flex-col items-center gap-3 rounded-2xl p-4 text-center transition hover:-translate-y-1"
              >
                <SkillIcon name={skill.name} iconUrl={skill.iconUrl} size={40} />
                <span className="text-xs font-medium leading-tight text-[var(--color-muted)] group-hover:text-[var(--color-foreground)]">
                  {skill.name}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
