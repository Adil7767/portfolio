/** `published === true` → visible on public site (Active). `false` → Archived. */

export type VisibilityStatus = "active" | "archived";

export function toVisibility(published: boolean): VisibilityStatus {
  return published ? "active" : "archived";
}

export function fromVisibility(status: VisibilityStatus): boolean {
  return status === "active";
}

export const visibilityLabels = {
  active: { label: "Active", hint: "Visible on public portfolio", color: "emerald" },
  archived: { label: "Archived", hint: "Hidden from public site", color: "zinc" },
} as const;
