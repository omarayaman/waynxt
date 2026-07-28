import React from "react";
import Image from "next/image";
import Link from "next/link";
import { PUBLIC_ASSETS } from "@/lib/public-assets";

export default function UpcomingEvents() {
  return (
    <section className="w-full bg-background py-20 px-4 flex flex-col items-center">
      <div className="max-w-[1000px] w-full flex flex-col items-center">
        <h2 className="text-4xl md:text-[44px] font-bold text-foreground mb-4 text-center">
          Happening Soon
        </h2>
        <p className="text-muted text-base md:text-lg text-center mb-12">
          Don&apos;t miss out on Egypt&apos;s most spectacular cultural events.
        </p>

        {/* Banner Card */}
        <div className="relative w-full rounded-3xl overflow-hidden bg-[#111] border border-white/10 shadow-2xl flex flex-col md:flex-row min-h-[400px]">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src={PUBLIC_ASSETS.images.luxorFestival}
              alt="Luxor Sphinx Festival"
              fill
              sizes="100vw"
              className="object-cover"
            />
            {/* Dark gradient for text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/80 to-transparent"></div>
          </div>

         
            {/* Featured Tag (Mobile view usually places it at top, desktop might float right, we'll keep it inline top for simplicity or absolute top right) */}
            <div className="absolute top-8 right-8 border border-accent text-accent text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 bg-background/50 backdrop-blur-sm">
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
          <div className="relative z-10 p-8 md:p-12 flex flex-col w-full md:w-[65%]">
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-4 pr-32 md:pr-0">
              Luxor Sphinx Festival
            </h3>
            <p className="text-gray-300 text-base md:text-lg mb-8 leading-relaxed">
              Experience the grandeur of ancient Egypt with illuminated temples,
              traditional performances, and cultural ceremonies.
            </p>

            <div className="flex flex-col gap-3 mb-8">
              <span className="text-gray-400 text-sm">Event starts in:</span>
              <div className="flex gap-4">
                {/* Timer Box */}
                <div className="flex flex-col items-center justify-center bg-[#1a1a1a]/80 backdrop-blur-sm border border-white/10 rounded-xl w-[70px] h-[75px]">
                  <span className="text-accent font-bold text-2xl">12</span>
                  <span className="text-gray-400 text-[11px] uppercase tracking-wider">
                    Days
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center bg-[#1a1a1a]/80 backdrop-blur-sm border border-white/10 rounded-xl w-[70px] h-[75px]">
                  <span className="text-accent font-bold text-2xl">05</span>
                  <span className="text-gray-400 text-[11px] uppercase tracking-wider">
                    Hours
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center bg-[#1a1a1a]/80 backdrop-blur-sm border border-white/10 rounded-xl w-[70px] h-[75px]">
                  <span className="text-accent font-bold text-2xl">34</span>
                  <span className="text-gray-400 text-[11px] uppercase tracking-wider">
                    Minutes
                  </span>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-4 mt-auto">
              <Link
                href="/events/luxor-sphinx"
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
              </Link>
              
              <button className="inline-flex items-center gap-2 bg-[#2a2a2a] hover:bg-[#333] border border-white/10 text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors">
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
                >
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                Notify Me
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
