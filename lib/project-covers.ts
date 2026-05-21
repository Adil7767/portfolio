/** High-quality cover images for project cards (Unsplash + Cloudinary-safe) */

const u = (photoId: string) =>
  `https://images.unsplash.com/${photoId}?w=800&h=450&fit=crop&q=80&auto=format`;

export const projectCoverByName: Record<string, string> = {
  "360 Living": u("photo-1560518883-ce09059eeffa"),
  BridgeBond: u("photo-1454165804606-c3d57bc86b40"),
  "Digital Dehari": u("photo-1574323346607-710ad78825ae"),
  "Babu ISP": u("photo-1558494949-ef010cbdcc31"),
  "AgriMarket Connect (ATI)": u("photo-1625246333195-78d9c38ad449"),
  "Oono — AI Stories Platform": u("photo-1677442136019-21780ecad995"),
  "Orum Training / Enigmatix": u("photo-1571019614242-c5c5dee9f50e"),
  EasyStream: u("photo-1611162616305-c69b303a61be"),
  "Freedoms AI": u("photo-1677442136019-21780ecad995"),
  ArbShark: u("photo-1611974789855-9417a99a3da0"),
  Sayber: u("photo-1551288049-bebda4e38f71"),
  "Tennis Trainer": u("photo-1554068865-24cecd4e3bb0"),
  "Hydra LAN Control": u("photo-1558494949-ef010cbdcc31"),
};

export const defaultProjectCover = u("photo-1498050108023-c5249f27df09");

export function isWeakProjectCover(url: string) {
  const u = url.toLowerCase();
  return (
    u.includes("google.com/s2/favicons") ||
    u.includes("opengraph.githubassets.com") ||
    u.includes("github.com/opengraph") ||
    u.includes("/favicon")
  );
}

/** Prefer curated covers; skip tiny favicons and broken GitHub OG URLs */
export function resolveProjectImageUrl(name: string, dbUrl?: string | null) {
  const canonical = projectCoverByName[name];
  if (canonical) return canonical;

  const url = dbUrl?.trim() ?? "";
  if (url.includes("res.cloudinary.com")) return url;
  if (url && !isWeakProjectCover(url)) return url;

  return defaultProjectCover;
}
