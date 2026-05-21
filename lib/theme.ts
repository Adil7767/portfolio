export const THEME_STORAGE_KEY = "portfolio-accent-color";

/** Default portfolio accent (current purple). */
export const DEFAULT_ACCENT = "#7c6dfa";

export const DEFAULT_GLOW = "#38bdf8";

export type ThemePalette = {
  accent: string;
  accentSoft: string;
  glow: string;
  accentDeep: string;
  accentRgb: string;
};

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function normalizeHex(input: string): string | null {
  const raw = input.trim();
  if (/^#[0-9A-Fa-f]{6}$/.test(raw)) return raw.toLowerCase();
  if (/^#[0-9A-Fa-f]{3}$/.test(raw)) {
    const h = raw.slice(1);
    return `#${h[0]}${h[0]}${h[1]}${h[1]}${h[2]}${h[2]}`.toLowerCase();
  }
  if (/^[0-9A-Fa-f]{6}$/.test(raw)) return `#${raw.toLowerCase()}`;
  return null;
}

function hexToRgb(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b].map((x) => clamp(Math.round(x), 0, 255).toString(16).padStart(2, "0")).join("")}`;
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      default:
        h = ((r - g) / d + 4) / 6;
    }
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToRgb(h: number, s: number, l: number) {
  h /= 360;
  s /= 100;
  l /= 100;
  if (s === 0) {
    const v = l * 255;
    return { r: v, g: v, b: v };
  }
  const hue2rgb = (p: number, q: number, t: number) => {
    let tt = t;
    if (tt < 0) tt += 1;
    if (tt > 1) tt -= 1;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return {
    r: hue2rgb(p, q, h + 1 / 3) * 255,
    g: hue2rgb(p, q, h) * 255,
    b: hue2rgb(p, q, h - 1 / 3) * 255,
  };
}

export function paletteFromAccent(accentHex: string): ThemePalette {
  const accent = normalizeHex(accentHex) ?? DEFAULT_ACCENT;
  const { r, g, b } = hexToRgb(accent);
  const { h, s, l } = rgbToHsl(r, g, b);

  const softRgb = hslToRgb(h, clamp(s * 0.85, 0, 100), clamp(l + 14, 0, 92));
  const glowRgb = hslToRgb((h + 42) % 360, clamp(s * 0.75, 0, 100), clamp(l + 8, 0, 88));
  const deepRgb = hslToRgb(h, clamp(s * 1.05, 0, 100), clamp(l - 18, 8, 55));
  const accentSoft = rgbToHex(softRgb.r, softRgb.g, softRgb.b);
  const glow = rgbToHex(glowRgb.r, glowRgb.g, glowRgb.b);
  const accentDeep = rgbToHex(deepRgb.r, deepRgb.g, deepRgb.b);

  return {
    accent,
    accentSoft,
    glow,
    accentDeep,
    accentRgb: `${r}, ${g}, ${b}`,
  };
}

export function getDefaultPalette(): ThemePalette {
  return paletteFromAccent(DEFAULT_ACCENT);
}

export function applyThemePalette(palette: ThemePalette) {
  const root = document.documentElement;
  root.style.setProperty("--color-accent", palette.accent);
  root.style.setProperty("--color-accent-soft", palette.accentSoft);
  root.style.setProperty("--color-glow", palette.glow);
  root.style.setProperty("--color-accent-deep", palette.accentDeep);
  root.style.setProperty("--color-accent-rgb", palette.accentRgb);
}

export function applyAccentTheme(accentHex: string) {
  applyThemePalette(paletteFromAccent(accentHex));
}

export function applyDefaultTheme() {
  const palette = paletteFromAccent(DEFAULT_ACCENT);
  palette.glow = DEFAULT_GLOW;
  applyThemePalette(palette);
}

export function loadStoredAccent(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored ? normalizeHex(stored) : null;
  } catch {
    return null;
  }
}

export function saveAccent(accentHex: string) {
  const normalized = normalizeHex(accentHex);
  if (!normalized) return;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, normalized);
  } catch {
    /* ignore */
  }
  applyAccentTheme(normalized);
}

export function clearStoredAccent() {
  try {
    localStorage.removeItem(THEME_STORAGE_KEY);
  } catch {
    /* ignore */
  }
  applyDefaultTheme();
}

/** Inline script for layout — runs before paint to avoid theme flash. */
export const themeInitScript = `(function(){try{var k='${THEME_STORAGE_KEY}';var d='${DEFAULT_ACCENT}';var c=localStorage.getItem(k);var h=(c&&/^#[0-9A-Fa-f]{6}$/.test(c))?c:d;var n=parseInt(h.slice(1),16);var r=(n>>16)&255,g=(n>>8)&255,b=n&255;var el=document.documentElement;el.style.setProperty('--color-accent',h);el.style.setProperty('--color-accent-rgb',r+', '+g+', '+b);}catch(e){}})();`;
