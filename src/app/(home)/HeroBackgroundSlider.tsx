"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { resolveTheme, useThemeStore } from "@/store/useThemeStore";

const LIGHT_HERO = {
  src: "/images/1 light.png",
  alt: "Nefertiti bust on a light background — Egyptian heritage",
} as const;

const DARK_SLIDES = [
  {
    src: "/images/1 (1).png",
    alt: "Nefertiti bust — Egyptian heritage",
  },
  {
    src: "/images/2 (1).png",
    alt: "Pharaoh statue — Ancient Egypt",
  },
  {
    src: "/images/3 (1).png",
    alt: "Egyptian landscape through an archway at golden hour",
  },
] as const;

const SLIDE_DURATION_MS = 6000;
const FADE_DURATION_S = 1.8;

export default function HeroBackgroundSlider() {
  const themeMode = useThemeStore((state) => state.theme);
  const [isDark, setIsDark] = useState(true);
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const apply = () => setIsDark(resolveTheme(themeMode) === "dark");
    apply();

    if (themeMode !== "system") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [themeMode]);

  const goToNext = useCallback(() => {
    setCurrent((prev) => (prev + 1) % DARK_SLIDES.length);
  }, []);

  useEffect(() => {
    if (!isDark || isPaused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(goToNext, SLIDE_DURATION_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [current, goToNext, isDark, isPaused]);

  const slideDurationS = SLIDE_DURATION_MS / 1000;
  const fadeDuration = prefersReducedMotion ? 0.4 : FADE_DURATION_S;

  if (!isDark) {
    return (
      <div className="absolute inset-0 z-0 overflow-hidden bg-white" aria-hidden>
        <Image
          src={LIGHT_HERO.src}
          alt={LIGHT_HERO.alt}
          fill
          priority
          quality={100}
          sizes="100vw"
          className="object-cover object-right mt-12"
        />
      </div>
    );
  }

  return (
    <div
      className="absolute inset-0 z-0 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-hidden
    >
      <div className="absolute inset-0 bg-background" />

      <AnimatePresence initial={false}>
        <motion.div
          key={current}
          className="absolute inset-0"
          initial={
            prefersReducedMotion
              ? { opacity: 0 }
              : { opacity: 0, scale: 1.04, filter: "blur(10px) brightness(0.75)" }
          }
          animate={
            prefersReducedMotion
              ? { opacity: 1 }
              : {
                  opacity: 1,
                  scale: 1.1,
                  filter: "blur(0px) brightness(1)",
                }
          }
          exit={
            prefersReducedMotion
              ? { opacity: 0 }
              : {
                  opacity: 0,
                  scale: 1.12,
                  filter: "blur(14px) brightness(0.6)",
                }
          }
          transition={{
            opacity: { duration: fadeDuration, ease: [0.4, 0, 0.2, 1] },
            scale: prefersReducedMotion
              ? { duration: 0 }
              : { duration: slideDurationS, ease: "linear" },
            filter: { duration: fadeDuration, ease: "easeInOut" },
          }}
        >
          <Image
            src={DARK_SLIDES[current].src}
            alt={DARK_SLIDES[current].alt}
            fill
            priority={current === 0}
            quality={100}
            sizes="100vw"
            className="object-cover object-center"
          />
        </motion.div>
      </AnimatePresence>

      {!prefersReducedMotion && (
        <AnimatePresence mode="wait">
          <motion.div
            key={`sweep-${current}`}
            className="pointer-events-none absolute inset-0 z-[1]"
            initial={{ x: "-120%", opacity: 0.7 }}
            animate={{ x: "120%", opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background:
                "linear-gradient(105deg, transparent 35%, color-mix(in srgb, var(--accent) 18%, transparent) 48%, rgba(255,235,150,0.12) 52%, transparent 65%)",
            }}
          />
        </AnimatePresence>
      )}

      <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-r from-[#050505]/95 via-[#050505]/55 to-[#050505]/20" />
      <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-[#050505]/80 via-transparent to-[#050505]/30" />
    </div>
  );
}
