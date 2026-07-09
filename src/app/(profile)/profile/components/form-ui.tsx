"use client";

import React from "react";

interface OptionChipProps {
  label: string;
  desc?: string;
  icon?: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

export function OptionChip({ label, desc, icon, isActive, onClick }: OptionChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all ${
        isActive
          ? "border-accent bg-accent-subtle text-foreground font-medium"
          : "border-border bg-surface text-muted hover:border-accent/30 hover:text-foreground"
      }`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>
        <span className="font-medium">{label}</span>
        {desc && <span className="block text-[11px] text-muted mt-0.5">{desc}</span>}
      </span>
    </button>
  );
}

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  error?: string;
}

export function FormField({ label, children, error }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-foreground block font-medium">{label}</label>
      {children}
      {error && <p className="text-red-500 dark:text-red-400 text-xs">{error}</p>}
    </div>
  );
}

export const inputClassName =
  "w-full px-3.5 py-2.5 bg-surface rounded-lg border border-border text-foreground placeholder:text-muted focus:outline-none focus:border-accent transition-colors text-sm";

export const submitButtonClassName =
  "w-full py-2.5 bg-accent text-accent-foreground font-medium rounded-lg text-sm hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

export const dangerButtonClassName =
  "w-full py-2.5 bg-transparent border border-red-500/30 text-red-600 dark:text-red-400 font-medium rounded-lg text-sm hover:bg-red-500/10 transition-colors disabled:opacity-50";
