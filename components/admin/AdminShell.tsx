import AdminNav from "./AdminNav";

export default function AdminShell({
  title,
  description,
  children,
  action,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="admin-theme flex min-h-screen">
      <AdminNav />
      <main className="ml-64 flex-1 px-8 py-10">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent-soft)]">
              Portfolio CMS
            </p>
            <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">
              {title}
            </h1>
            {description && (
              <p className="mt-2 max-w-xl text-[var(--color-muted)]">
                {description}
              </p>
            )}
          </div>
          {action}
        </div>
        {children}
      </main>
    </div>
  );
}
