"use client";

import { useEffect, useState } from "react";
import { Palette, RotateCcw } from "lucide-react";
import {
  DEFAULT_ACCENT,
  applyAccentTheme,
  applyDefaultTheme,
  clearStoredAccent,
  loadStoredAccent,
  normalizeHex,
  saveAccent,
} from "@/lib/theme";

export default function ThemePicker() {
  const [accent, setAccent] = useState(DEFAULT_ACCENT);

  useEffect(() => {
    const stored = loadStoredAccent();
    if (stored) {
      setAccent(stored);
      applyAccentTheme(stored);
    } else {
      applyDefaultTheme();
    }
  }, []);

  function onColorChange(value: string) {
    const hex = normalizeHex(value);
    if (!hex) return;
    setAccent(hex);
    saveAccent(hex);
  }

  function resetTheme() {
    setAccent(DEFAULT_ACCENT);
    clearStoredAccent();
    applyDefaultTheme();
  }

  return (
    <div className="relative z-[100] flex items-center gap-1">
      <label className="group relative flex cursor-pointer items-center gap-2 overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm font-medium text-[var(--color-muted)] transition hover:border-[var(--color-accent-soft)] hover:text-[var(--color-foreground)]">
        <input
          type="color"
          value={accent}
          onChange={(e) => onColorChange(e.target.value)}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          aria-label="Pick theme accent color"
        />
        <Palette
          size={16}
          className="pointer-events-none relative z-[1] text-[var(--color-accent-soft)]"
        />
        <span
          className="pointer-events-none relative z-[1] h-5 w-5 shrink-0 rounded-full border border-[var(--color-border-strong)] shadow-inner"
          style={{ background: `linear-gradient(135deg, ${accent}, var(--color-glow))` }}
        />
        <span className="pointer-events-none relative z-[1] hidden sm:inline">Theme</span>
      </label>

      <button
        type="button"
        onClick={resetTheme}
        title="Reset theme to default"
        className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-2 text-[var(--color-muted)] transition hover:border-[var(--color-accent-soft)] hover:text-[var(--color-foreground)]"
      >
        <RotateCcw size={14} />
      </button>
    </div>
  );
}
