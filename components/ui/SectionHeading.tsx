export default function SectionHeading({
  eyebrow,
  title,
  highlight,
  description,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  highlight?: string;
  description?: string;
  align?: "center" | "left";
}) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <div className={`max-w-2xl ${alignClass}`}>
      {eyebrow && (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent-soft)]">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
        {title && <>{title} </>}
        {highlight ? (
          <span className="gradient-text">{highlight}</span>
        ) : (
          !title && <span className="gradient-text">Portfolio</span>
        )}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-[var(--color-muted)] sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}
