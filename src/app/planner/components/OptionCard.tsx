import React from "react";

interface OptionCardProps {
  label: string;
  desc: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  compact?: boolean;
}

export default function OptionCard({
  label,
  desc,
  icon,
  isActive,
  onClick,
  compact = false,
}: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full flex-col items-start rounded-lg border text-left transition-colors duration-150 ${
        compact ? "gap-0.5 p-2.5" : "gap-1 p-3"
      } ${
        isActive
          ? "border-foreground bg-surface-elevated dark:border-accent dark:bg-accent/10 dark:shadow-[0_0_12px_rgba(247,234,0,0.12)]"
          : "border-border bg-surface hover:border-border dark:border-white/10 dark:bg-black/25 dark:hover:border-white/20 dark:hover:bg-black/35"
      }`}
    >
      <div className="flex items-center gap-2">
        <div
          className={`shrink-0 ${
            isActive ? "text-foreground dark:text-accent" : "text-muted dark:text-gray-400"
          }`}
        >
          {icon}
        </div>
        <span
          className={`text-sm leading-tight ${
            isActive
              ? "font-semibold text-foreground dark:text-accent"
              : "font-medium text-foreground dark:text-white"
          }`}
        >
          {label}
        </span>
      </div>
      <span
        className={`text-xs leading-snug ${
          isActive ? "text-muted dark:text-accent/75" : "text-muted dark:text-gray-500"
        }`}
      >
        {desc}
      </span>
    </button>
  );
}
