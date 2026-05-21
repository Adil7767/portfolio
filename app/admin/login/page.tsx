"use client";

import { useState } from "react";
import { Lock, Mail, Shield } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);
    if (!res.ok) {
      setError("Invalid email or password");
      return;
    }

    const data = (await res.json()) as { redirect?: string };
    const target = data.redirect ?? "/admin/site";
    // Full navigation so middleware sees the new httpOnly session cookie
    window.location.assign(target);
  }

  return (
    <div className="admin-theme mesh-bg flex min-h-screen items-center justify-center px-6">
      <form
        onSubmit={handleSubmit}
        className="card-premium w-full max-w-md rounded-2xl p-10"
      >
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-accent)]/20">
            <Shield className="text-[var(--color-accent-soft)]" size={28} />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold">Owner sign in</h1>
            <p className="text-sm text-[var(--color-muted)]">
              Manage resume, projects & site copy
            </p>
          </div>
        </div>

        <label htmlFor="email" className="mb-2 block text-xs font-medium text-[var(--color-muted)]">
          Email
        </label>
        <div className="relative mb-4">
          <Mail
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)]"
          />
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field !pl-11"
            placeholder="you@email.com"
            required
          />
        </div>

        <label htmlFor="password" className="mb-2 block text-xs font-medium text-[var(--color-muted)]">
          Password
        </label>
        <div className="relative">
          <Lock
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)]"
          />
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field !pl-11"
            placeholder="Enter password"
            required
          />
        </div>

        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

        <button type="submit" disabled={loading} className="btn-primary mt-8 w-full">
          {loading ? "Signing in..." : "Access dashboard"}
        </button>

        <p className="mt-8 text-center text-xs text-[var(--color-muted)]">
          <Link href="/" className="hover:text-[var(--color-foreground)]">
            ← Back to portfolio
          </Link>
        </p>
      </form>
    </div>
  );
}
