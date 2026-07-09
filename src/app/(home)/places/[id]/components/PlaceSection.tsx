import type { ReactNode } from "react";

interface PlaceSectionProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function PlaceSection({
  title,
  subtitle,
  action,
  children,
  className = "",
}: PlaceSectionProps) {
  return (
    <section className={className}>
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground md:text-xl">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-1 text-sm text-muted">{subtitle}</p>
          )}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
