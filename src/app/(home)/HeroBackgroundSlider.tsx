"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { PUBLIC_ASSETS } from "@/lib/public-assets";
import { useIsDark } from "@/store/useThemeStore";

const LIGHT_SLIDES = [
  {
    src: PUBLIC_ASSETS.images.heroLight.one,
    alt: "Nefertiti bust — Egyptian heritage",
  },
  {
    src: PUBLIC_ASSETS.images.heroLight.two,
    alt: "Pharaoh statue — Ancient Egypt",
  },
  {
    src: PUBLIC_ASSETS.images.heroLight.three,
    alt: "Egyptian landscape through an archway at golden hour",
  },
] as const;

const DARK_SLIDES = [
  {
    src: PUBLIC_ASSETS.images.heroDark.one,
    alt: "Nefertiti bust — Egyptian heritage",
  },
  {
    src: PUBLIC_ASSETS.images.heroDark.two,
    alt: "Pharaoh statue — Ancient Egypt",
  },
  {
    src: PUBLIC_ASSETS.images.heroDark.three,
    alt: "Egyptian landscape through an archway at golden hour",
  },
] as const;

const SLIDE_DURATION_MS = 6000;
const FADE_DURATION_S = 1.8;

export default function HeroBackgroundSlider() {
  const isDark = useIsDark();
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const slides = isDark ? DARK_SLIDES : LIGHT_SLIDES;

  const goToNext = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrent(0);
    }, 0);
    return () => clearTimeout(timer);
  }, [isDark]);

  useEffect(() => {
    if (isPaused) {
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
  }, [current, goToNext, isPaused]);

  const slideDurationS = SLIDE_DURATION_MS / 1000;
  const fadeDuration = prefersReducedMotion ? 0.4 : FADE_DURATION_S;
  const activeSlide = slides[current];

  return (
    <div
      className={`absolute inset-0 z-0 overflow-hidden ${isDark ? "" : "bg-white"}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-hidden
    >
      {isDark && <div className="absolute inset-0 bg-background" />}

      <AnimatePresence initial={false}>
        <motion.div
          key={`${isDark ? "dark" : "light"}-${current}`}
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
            src={activeSlide.src}
            alt={activeSlide.alt}
            fill
            priority={current === 0}
            quality={100}
            sizes="100vw"
            className={
              isDark
                ? "object-cover object-right lg:object-center"
                : "mt-12 object-cover object-right lg:object-center opacity-50"
            }
          />
        </motion.div>
      </AnimatePresence>

      {isDark && !prefersReducedMotion && (
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

      {isDark ? (
        <>
          <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-r from-[#050505]/95 via-[#050505]/55 to-[#050505]/20" />
          <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-[#050505]/80 via-transparent to-[#050505]/30" />
        </>
      ) : (
        <>
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 z-[2] bg-gradient-to-b from-background/90 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 z-[2] bg-gradient-to-t from-background/95 to-transparent" />
        </>
      )}
    </div>
  );
}
