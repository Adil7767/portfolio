import { redirect } from "next/navigation";
import { verifyAdminSession } from "@/lib/auth";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ok = await verifyAdminSession();
  if (!ok) redirect("/admin/login");

  return <>{children}</>;
}
