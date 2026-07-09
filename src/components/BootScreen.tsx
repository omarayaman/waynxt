"use client";

import { useEffect } from "react";

const MIN_DISPLAY_MS = 900;
const EXIT_MS = 480;

export function BootScreen() {
  useEffect(() => {
    const root = document.documentElement;
    const boot = document.getElementById("waynxt-boot");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const minDisplay = reducedMotion ? 0 : MIN_DISPLAY_MS;
    const startedAt = performance.now();

    const revealApp = () => {
      const elapsed = performance.now() - startedAt;
      const wait = Math.max(0, minDisplay - elapsed);

      window.setTimeout(() => {
        root.setAttribute("data-boot", "ready");
        boot?.setAttribute("aria-busy", "false");

        window.setTimeout(() => {
          boot?.remove();
        }, EXIT_MS);
      }, wait);
    };

    if (document.readyState === "complete") {
      revealApp();
      return;
    }

    window.addEventListener("load", revealApp, { once: true });
    return () => window.removeEventListener("load", revealApp);
  }, []);

  return null;
}
