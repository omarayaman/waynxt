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
        <h2 className="text-lg font-bold font-clash text-white">{title}</h2>
        <p className="text-gray-400 text-xs mt-0.5">{subtitle}</p>
      </div>
      {children}
    </section>
  );
}
