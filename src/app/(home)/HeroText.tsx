"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { GsapButton } from "@/components/GsapButton";

const ROTATING_WORDS = [
  "immersive storytelling",
  "real-time AI answers",
  "smart travel guides",
];

export default function HeroText() {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // GSAP Entrance Animation
  useEffect(() => {
    if (headlineRef.current) {
      gsap.fromTo(
        headlineRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      );
    }
    if (buttonRef.current) {
      gsap.fromTo(
        buttonRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 0.2 }
      );
    }
  }, []);

  // Typing Effect
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const currentWord = ROTATING_WORDS[currentWordIndex];
    
    if (isDeleting) {
      if (typedText.length > 0) {
        timeout = setTimeout(() => {
          setTypedText(currentWord.substring(0, typedText.length - 1));
        }, 50); // Deleting speed
      } else {
        setIsDeleting(false);
        setCurrentWordIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
      }
    } else {
      if (typedText.length < currentWord.length) {
        timeout = setTimeout(() => {
          setTypedText(currentWord.substring(0, typedText.length + 1));
        }, 100); // Typing speed
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 2000); // Pause before deleting
      }
    }

    return () => clearTimeout(timeout);
  }, [typedText, isDeleting, currentWordIndex]);

  return (
    <div className="max-w-[550px] pt-10 relative z-10">
      <h1 
        ref={headlineRef}
        className="text-[56px] lg:text-[72px] font-bold text-foreground dark:text-white mb-6 leading-[1.05] tracking-tight opacity-0"
      >
        Explore Egypt with clarity.
      </h1>
      
      <p className="text-muted dark:text-white/75 text-lg lg:text-[20px] leading-relaxed mb-12 max-w-[550px] min-h-[60px] lg:min-h-[30px]">
        Explore Egypt through{" "}
        <span className="text-foreground dark:text-white font-medium inline">
          {typedText}
          <span className="animate-[pulse_1s_ease-in-out_infinite] font-light inline-block w-[2px] -ml-1">|</span>
        </span>
      </p>
      
      <div ref={buttonRef} className="opacity-0">
        <GsapButton
          href="/places"
          className="group inline-flex items-center gap-3 bg-accent after:absolute after:inset-0 after:border-2 after:border-accent after:rounded-xl after:pointer-events-none after:z-[10] text-accent font-medium dark:font-semibold text-[16px] px-8 py-4 rounded-xl shadow-[0_4px_24px_color-mix(in_srgb,var(--accent)_35%,transparent)] hover:shadow-[0_6px_32px_color-mix(in_srgb,var(--accent)_45%,transparent)]"
          innerBg="#0a0a0a"
          magneticFill={true}
        >
          Start Exploring
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform group-hover:translate-x-1"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </GsapButton>
      </div>
    </div>
  );
}
