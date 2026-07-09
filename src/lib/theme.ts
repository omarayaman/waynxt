export type ThemeMode = "light" | "dark" | "system";

export const THEME_STORAGE_KEY = "waynxt-theme";

export function resolveTheme(theme: ThemeMode): "light" | "dark" {
  if (theme === "light") return "light";
  if (theme === "dark") return "dark";
  if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
}

export function applyThemeClass(resolved: "light" | "dark"): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.toggle("dark", resolved === "dark");
  root.style.colorScheme = resolved;
  root.setAttribute("data-theme", resolved);
}

/**
 * Runs synchronously in <head> before first paint.
 * Applies saved theme immediately and marks boot state for the splash screen.
 */
export const themeInitScript = `(function(){try{var s=localStorage.getItem("${THEME_STORAGE_KEY}");var t=s?JSON.parse(s).state.theme:"dark";var r=t==="light"?"light":t==="dark"?"dark":window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";var d=document.documentElement;d.classList.toggle("dark",r==="dark");d.style.colorScheme=r;d.setAttribute("data-theme",r);}catch(e){var f=document.documentElement;f.classList.add("dark");f.style.colorScheme="dark";f.setAttribute("data-theme","dark");}document.documentElement.setAttribute("data-boot","theme");})();`;

/** Minimal CSS injected in <head> to prevent theme flash before React hydrates. */
export const bootCriticalCss = `
  html:not([data-boot="theme"]) body { background:#000; }
  html:not([data-boot="ready"]) #app-content { visibility:hidden; }
  html:not([data-boot="ready"]) * ,
  html:not([data-boot="ready"]) *::before,
  html:not([data-boot="ready"]) *::after { transition:none !important; }
  #waynxt-boot {
    position:fixed; inset:0; z-index:2147483647;
    background:var(--background,#000); color:var(--foreground,#fff);
    opacity:1; visibility:visible;
    transition:opacity .48s ease, visibility .48s ease, filter .48s ease;
  }
  html[data-boot="ready"] #waynxt-boot {
    opacity:0; visibility:hidden; pointer-events:none;
    filter:blur(6px);
    transition:opacity .48s ease, visibility .48s ease, filter .48s ease;
  }
`;
