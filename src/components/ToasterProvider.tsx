"use client";

import { Toaster } from "sonner";
import { resolveTheme, useThemeStore } from "@/store/useThemeStore";

export function ToasterProvider() {
  const theme = useThemeStore((state) => state.theme);
  const resolved = resolveTheme(theme);

  return (
    <Toaster
      position="top-center"
      theme={resolved}
      toastOptions={{
        classNames: {
          toast:
            "bg-surface border border-border text-foreground",
          success: "border-accent/30",
          error: "border-red-500/30",
        },
      }}
    />
  );
}
