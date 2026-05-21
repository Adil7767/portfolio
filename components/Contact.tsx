"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Send } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import type { profile } from "@/drizzle/schema";
import type { socialLinks } from "@/drizzle/schema";

type Profile = typeof profile.$inferSelect;
type Social = typeof socialLinks.$inferSelect;

export default function Contact({
  profile: p,
  socialLinks: links,
}: {
  profile: Profile | null;
  socialLinks: Social[];
}) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setForm({ name: "", email: "", message: "" });
      setStatus("ok");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="section-pad relative">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Contact"
          title=""
          highlight={p?.contactHeading ?? "Get in touch"}
        />

        <div className="mt-16 grid gap-10 lg:grid-cols-2 lg:items-start">
          <motion.aside
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="card-premium rounded-2xl p-6">
              <Mail className="mb-3 text-[var(--color-accent-soft)]" size={22} />
              <h3 className="font-semibold">Email</h3>
              <a
                href={`mailto:${p?.email ?? "dev.adil786@gmail.com"}`}
                className="mt-2 block break-all text-[var(--color-accent-soft)] hover:underline"
              >
                {p?.email ?? "dev.adil786@gmail.com"}
              </a>
            </div>
            <div className="card-premium rounded-2xl p-6">
              <MapPin className="mb-3 text-[var(--color-glow)]" size={22} />
              <h3 className="font-semibold">Location</h3>
              <p className="mt-2 text-sm text-[var(--color-muted)]">
                {p?.location ?? "Lahore, Punjab, Pakistan"}
              </p>
            </div>
            <div className="card-premium rounded-2xl p-6">
              <h3 className="mb-4 font-semibold">Connect</h3>
              <div className="flex flex-wrap gap-3">
                {links.map((el) => (
                  <a
                    key={el.id}
                    href={el.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={el.name}
                    className="rounded-xl border border-[var(--color-border)] p-2 transition hover:border-[var(--color-accent)]"
                  >
                    {el.iconUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={el.iconUrl} alt={el.name} className="h-7 w-7" />
                    ) : (
                      <span className="px-2 text-xs">{el.name}</span>
                    )}
                  </a>
                ))}
              </div>
            </div>
          </motion.aside>

          <motion.form
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className="card-premium space-y-5 rounded-2xl p-8"
          >
            <p className="text-sm text-[var(--color-muted)]">
              Send a message — I typically reply within 24–48 hours.
            </p>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-2 block text-xs font-medium text-[var(--color-muted)]">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  autoComplete="name"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label htmlFor="email" className="mb-2 block text-xs font-medium text-[var(--color-muted)]">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@company.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>
            <div>
              <label htmlFor="message" className="mb-2 block text-xs font-medium text-[var(--color-muted)]">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                placeholder="Tell me about your project, role, or idea…"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="input-field resize-none"
              />
            </div>
            <button type="submit" disabled={status === "loading"} className="btn-primary w-full sm:w-auto">
              <Send size={18} />
              {status === "loading" ? "Sending..." : "Send message"}
            </button>
            {status === "ok" && (
              <p className="text-sm text-[var(--color-success)]">
                Thanks — I&apos;ll get back to you soon.
              </p>
            )}
            {status === "error" && (
              <p className="text-sm text-red-400">
                Could not send. Email me at{" "}
                <a href={`mailto:${p?.email}`} className="underline">
                  {p?.email ?? "dev.adil786@gmail.com"}
                </a>
              </p>
            )}
          </motion.form>
        </div>
      </div>

      <footer className="mx-auto mt-24 max-w-6xl border-t border-[var(--color-border)] px-6 py-10 text-center text-sm text-[var(--color-muted)]">
        <p>
          © {new Date().getFullYear()} {p?.name ?? "Adil Mustafa"}. Built with Next.js & Supabase.
        </p>
      </footer>
    </section>
  );
}
