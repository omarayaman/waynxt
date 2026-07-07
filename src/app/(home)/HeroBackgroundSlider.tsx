"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const SLIDES = [
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
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goToSlide = useCallback((index: number) => {
    setCurrent(index);
  }, []);

  const goToNext = useCallback(() => {
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  }, []);

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

  return (
    <div
      className="absolute inset-0 z-0 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-hidden
    >
      <div className="absolute inset-0 bg-[#050505]" />

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
            src={SLIDES[current].src}
            alt={SLIDES[current].alt}
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
                "linear-gradient(105deg, transparent 35%, rgba(223,214,22,0.18) 48%, rgba(255,235,150,0.12) 52%, transparent 65%)",
            }}
          />
        </AnimatePresence>
      )}

      <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-r from-[#050505]/95 via-[#050505]/55 to-[#050505]/20" />
      <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-[#050505]/80 via-transparent to-[#050505]/30" />
    </div>
  );
}
