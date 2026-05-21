import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Owner Dashboard | Portfolio",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
      {children}
    </div>
  );
}
