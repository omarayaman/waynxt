"use client";

import { Moon, Sun } from "lucide-react";
import { useIsDark, useThemeStore } from "@/store/useThemeStore";

interface ThemeToggleProps {
  className?: string;
  variant?: "default" | "navbar";
}

export function ThemeToggle({ className = "", variant = "default" }: ThemeToggleProps) {
  const { setTheme } = useThemeStore();
  const isDark = useIsDark();

  const toggle = () => {
    setTheme(isDark ? "light" : "dark");
  };

  const navbarStyles =
    "border-[var(--navbar-control-border)] bg-[var(--navbar-control-bg)] text-[var(--navbar-control-text)] hover:border-[var(--navbar-border)] hover:bg-[var(--navbar-control-bg)] hover:text-[var(--navbar-foreground)]";
  const defaultStyles =
    "border-border bg-surface-elevated/60 text-muted hover:border-accent hover:bg-accent-subtle hover:text-accent";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border transition-colors ${
        variant === "navbar" ? navbarStyles : defaultStyles
      } ${className}`}
    >
      {isDark ? <Sun size={16} strokeWidth={2} /> : <Moon size={16} strokeWidth={2} />}
    </button>
  );
}
