import Script from "next/script";
import { themeInitScript } from "@/lib/theme";

/** Applies saved accent before first paint (public site only). */
export default function ThemeInit() {
  return <Script id="theme-init" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: themeInitScript }} />;
}
