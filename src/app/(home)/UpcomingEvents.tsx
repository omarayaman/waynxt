"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { PUBLIC_ASSETS } from "@/lib/public-assets";
import { useAuthStore } from "@/store/useAuthStore";
import { AnimatePresence, motion } from "framer-motion";

function getNextEventDate() {
  const now = new Date();
  const year = now.getFullYear();
  const oct22 = new Date(year, 9, 22, 5, 53, 0); // Oct is 9 (0-indexed)
  const feb22 = new Date(year, 1, 22, 5, 53, 0); // Feb is 1

  if (now < feb22) return feb22;
  if (now < oct22) return oct22;
  return new Date(year + 1, 1, 22, 5, 53, 0);
}

export default function UpcomingEvents() {
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const [isNotified, setIsNotified] = useState(false);
  const [showFloatingNotify, setShowFloatingNotify] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });
  const { isAuthenticated } = useAuthStore();
  
  // Close modal on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsStoryOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Timer logic
  useEffect(() => {
    const targetDate = getNextEventDate().getTime();
    
    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0 });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

      setTimeLeft({ days, hours, minutes });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000); // update every minute

    return () => clearInterval(interval);
  }, []);

  const handleNotifyClick = () => {
    setIsNotified(true);
    // Dispatch an event so the Navbar can show the bell notification
    window.dispatchEvent(new CustomEvent('new-notification'));
    // Hide toast after a few seconds
    setTimeout(() => setIsNotified(false), 4000);
  };

  return (
    <section className="w-full bg-background py-20 px-4 flex flex-col items-center relative overflow-hidden">
      <div className="max-w-[1000px] w-full flex flex-col items-center relative z-10">
        <h2 className="text-4xl md:text-[44px] font-bold text-foreground mb-4 text-center">
          Upcoming Events
        </h2>
        <p className="text-muted text-base md:text-lg text-center mb-12">
          Don&apos;t miss out on Egypt&apos;s most spectacular cultural and historical events.
        </p>

        {/* Banner Card */}
        <div className="relative w-full rounded-3xl overflow-hidden bg-[#111] border border-white/10 shadow-2xl flex flex-col md:flex-row min-h-[400px]">
          {/* Background Image */}
          <div className="absolute inset-0 z-0 group">
            <Image
              src={PUBLIC_ASSETS.images.abuSimbel}
              alt="Sun Alignment on Ramses II"
              fill
              sizes="100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Dark gradient for text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/95 to-transparent w-full md:w-[70%]"></div>
          </div>

          {/* Featured Tag */}
          <div className="absolute top-8 right-8 border border-accent text-accent text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 bg-background/50 backdrop-blur-sm z-20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Featured Event
          </div>

          {/* Content */}
          <div className="relative z-10 p-8 md:p-12 flex flex-col w-full md:w-[60%] lg:w-[45%]">
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-4 pr-32 md:pr-0 leading-tight">
              Sun Alignment Festival
            </h3>
            <p className="text-gray-300 text-base md:text-lg mb-8 leading-relaxed">
              Witness the sun&apos;s rays illuminate King Ramses II at Abu Simbel, a unique astronomical phenomenon occurring twice a year.
            </p>

            <div className="flex flex-col gap-3 mb-8">
              <span className="text-gray-400 text-sm">Event starts in:</span>
              <div className="flex gap-4">
                {/* Timer Box */}
                <div className="flex flex-col items-center justify-center bg-[#1a1a1a]/80 backdrop-blur-sm border border-white/10 rounded-xl w-[70px] h-[75px]">
                  <span className="text-accent font-bold text-2xl">{String(timeLeft.days).padStart(2, '0')}</span>
                  <span className="text-gray-400 text-[11px] uppercase tracking-wider">
                    Days
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center bg-[#1a1a1a]/80 backdrop-blur-sm border border-white/10 rounded-xl w-[70px] h-[75px]">
                  <span className="text-accent font-bold text-2xl">{String(timeLeft.hours).padStart(2, '0')}</span>
                  <span className="text-gray-400 text-[11px] uppercase tracking-wider">
                    Hours
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center bg-[#1a1a1a]/80 backdrop-blur-sm border border-white/10 rounded-xl w-[70px] h-[75px]">
                  <span className="text-accent font-bold text-2xl">{String(timeLeft.minutes).padStart(2, '0')}</span>
                  <span className="text-gray-400 text-[11px] uppercase tracking-wider">
                    Minutes
                  </span>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-4 mt-auto">
              <button
                onClick={() => setIsStoryOpen(true)}
                className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-accent-foreground font-bold text-sm px-6 py-3 rounded-xl transition-colors group"
              >
                View Details
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="group-hover:translate-x-1 transition-transform"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </button>
              
              {isAuthenticated && (
                <button 
                  onClick={handleNotifyClick}
                  className="inline-flex items-center gap-2 bg-[#2a2a2a] hover:bg-[#333] border border-white/10 text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors group"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`${isNotified ? 'text-accent fill-accent scale-110' : ''} transition-all duration-300`}
                  >
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                  Notify Me
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- MODAL STORY --- */}
      <AnimatePresence>
        {isStoryOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md" 
              onClick={() => setIsStoryOpen(false)}
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", bounce: 0.25, duration: 0.4 }}
              className="relative w-full max-w-5xl bg-white dark:bg-black/50 dark:backdrop-blur-2xl dark:border dark:border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
            >
              {/* Close Button */}
            <button 
              onClick={() => setIsStoryOpen(false)}
              className="absolute top-4 right-4 z-50 bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 dark:bg-black/50 dark:hover:bg-black p-2 rounded-full dark:text-white/80 dark:hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            {/* Modal Image */}
            <div className="w-full md:w-[45%] lg:w-2/5 relative min-h-[250px] md:min-h-0 md:h-auto shrink-0 dark:[mask-image:linear-gradient(to_bottom,black_60%,transparent_100%)] md:dark:[mask-image:linear-gradient(to_right,black_60%,transparent_100%)]">
              <Image 
                src={PUBLIC_ASSETS.images.abuSimbelInterior} 
                alt="Abu Simbel Interior"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent dark:hidden md:hidden"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent dark:hidden hidden md:block"></div>
            </div>

            {/* Modal Content */}
            <div className="w-full md:w-[55%] lg:w-3/5 p-6 sm:p-8 md:p-10 flex flex-col overflow-y-auto">
              <div className="flex items-center gap-2 text-accent text-sm font-bold mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                Abu Simbel Temple, Aswan
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">The Legend of the Sun and the King</h2>
              
              <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed text-sm md:text-base">
                <p>
                  In an unparalleled astronomical and architectural phenomenon, the sun&apos;s rays align perfectly to illuminate the face of King Ramses II in the inner sanctuary of the great temple at Abu Simbel twice a year: on October 22 (his birthday) and February 22 (his coronation day).
                </p>
                <p>
                  The sunlight penetrates the long corridor of the temple for 60 meters to light up the faces of three statues: Ramses II, Amun-Ra, and Ra-Horakhty, while the statue of Ptah, the god of darkness, remains in the shadows.
                </p>
                <p>
                  Discovered in 1874 by the explorer Amelia Edwards, this event is considered one of the greatest achievements in astronomy and architecture by the ancient Egyptians.
                </p>
              </div>

              <div className="mt-8 bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-xl p-5">
                <h4 className="text-gray-900 dark:text-white font-bold mb-3">Event Details</h4>
                <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center gap-3">
                    <svg className="text-accent" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    October 22 - February 22
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="text-accent" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    Starts exactly at 5:53 AM and lasts for 20 minutes
                  </li>
                </ul>
              </div>
            </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal story remains above */}
    </section>
  );
}
