"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import ThemePicker from "@/components/ThemePicker";

const links = [
  { name: "Home", href: "/#home" },
  { name: "About", href: "/#about" },
  { name: "Services", href: "/#services" },
  { name: "Projects", href: "/#projects" },
  { name: "Contact", href: "/#contact" },
];

const brandStylized = "ꪖᦔꪱꪶ ꪑꪊకꪻꪖᠻꪖ";

export default function Navbar({ name = "Adil Mustafa" }: { name?: string }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 z-[100] isolate w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-background)_92%,transparent)] shadow-lg shadow-black/20 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <nav className="relative z-[100] mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link
          href="/#home"
          className="font-display text-base font-bold tracking-tight sm:text-lg"
          title={name}
        >
          <span className="gradient-text">{brandStylized}</span>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          <ul className="flex items-center gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-[var(--color-muted)] transition hover:bg-[var(--color-surface)] hover:text-[var(--color-foreground)]"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
          <ThemePicker />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemePicker />
          <button
            type="button"
            className="rounded-lg p-2 text-[var(--color-foreground)]"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-4 md:hidden">
          <ul className="flex flex-col gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-[var(--color-muted)] hover:bg-[var(--color-surface-elevated)] hover:text-white"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
