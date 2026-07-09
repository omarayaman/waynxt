"use client";

import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  applyThemeClass,
  resolveTheme,
  THEME_STORAGE_KEY,
  type ThemeMode,
} from "@/lib/theme";

export { applyThemeClass, resolveTheme, THEME_STORAGE_KEY };
export type { ThemeMode };

interface ThemeState {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
}

function subscribeToThemeClass(onStoreChange: () => void): () => void {
  const observer = new MutationObserver(onStoreChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

function getIsDarkSnapshot(): boolean {
  return document.documentElement.classList.contains("dark");
}

/** Reads resolved theme from the `<html class="dark">` set by the blocking script. */
export function useResolvedTheme(): "light" | "dark" {
  const isDark = useSyncExternalStore(
    subscribeToThemeClass,
    getIsDarkSnapshot,
    () => true
  );
  return isDark ? "dark" : "light";
}

export function useIsDark(): boolean {
  return useResolvedTheme() === "dark";
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "dark",
      setTheme: (theme) => {
        set({ theme });
        applyThemeClass(resolveTheme(theme));
      },
    }),
    {
      name: THEME_STORAGE_KEY,
      onRehydrateStorage: () => (state) => {
        if (state) applyThemeClass(resolveTheme(state.theme));
      },
    }
  )
);
