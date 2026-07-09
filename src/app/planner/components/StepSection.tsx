import React from "react";

interface StepSectionProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export default function StepSection({ title, subtitle, children }: StepSectionProps) {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="font-clash text-base font-bold text-foreground sm:text-lg dark:text-white">
          {title}
        </h2>
        <p className="mt-1 text-xs text-muted sm:text-sm dark:text-gray-400">{subtitle}</p>
      </div>
      {children}
    </section>
  );
}
