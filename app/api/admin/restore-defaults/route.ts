import { withAdminHandler } from "@/lib/admin-api";
import { restoreDefaultContent } from "@/lib/seed-defaults";

export async function POST() {
  return withAdminHandler(() => restoreDefaultContent());
}
