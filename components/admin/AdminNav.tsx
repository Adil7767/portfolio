"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Settings2,
} from "lucide-react";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/site", label: "Site content", icon: Settings2 },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
];

export default function AdminNav() {
  const pathname = usePathname();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST", credentials: "include" });
    window.location.assign("/admin/login");
  }

  return (
    <aside className="admin-theme fixed left-0 top-0 z-40 flex h-full w-64 flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <Link href="/admin" className="mb-10 block">
        <span className="font-display text-lg font-bold gradient-text">Studio</span>
        <span className="mt-0.5 block text-xs text-[var(--color-muted)]">Owner dashboard</span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href ||
            (href !== "/admin" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-[var(--color-accent)]/15 text-[var(--color-accent-soft)]"
                  : "text-[var(--color-muted)] hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-foreground)]"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={logout}
        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[var(--color-muted)] transition hover:bg-red-500/10 hover:text-red-400"
      >
        <LogOut size={18} />
        Logout
      </button>
      <Link
        href="/"
        target="_blank"
        className="mt-4 block rounded-xl border border-[var(--color-border)] py-2.5 text-center text-xs text-[var(--color-muted)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-foreground)]"
      >
        View public site →
      </Link>
    </aside>
  );
}
