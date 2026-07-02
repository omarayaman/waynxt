"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function AiSearchSection() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const uniqueSuggestions = [
    "Plan my first trip to Egypt",
    "Explain the history of the pyramids",
    "What should I know before visiting Cairo?",
    "Best places for a Nile cruise",
    "Museums worth visiting in one day",
  ];

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/ask-waynx?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <section className="relative w-full bg-[#050505] py-24 flex flex-col items-center justify-center px-4 overflow-hidden z-10">
      {/* Optional subtle gradient to blend with the hero section */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#050505] to-transparent"></div>

      <div className="max-w-[800px] w-full flex flex-col items-center z-10">
        <h2 className="text-4xl md:text-[44px] font-bold text-white mb-4 text-center">
          Explore with guidance
        </h2>
        <p className="text-gray-400 text-base md:text-lg text-center mb-10 max-w-[600px]">
          Get instant clarity about Egypt — before you visit or while you
          explore.
        </p>

        {/* Search Input Container */}
        <div className="w-full max-w-[690px] relative mb-10 group">
          {/* Subtle outer glow effect on hover/focus within */}
          <div className="absolute -inset-[1px] bg-gradient-to-r from-transparent via-[#E3D010]/30 to-transparent rounded-full opacity-0 group-focus-within:opacity-100 blur-sm transition-opacity duration-500"></div>
          
          <div className="relative flex items-center bg-[#111111] border border-[#E3D010]/40 rounded-full px-6 py-4 transition-all duration-300 focus-within:border-[#E3D010]">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about Egypt..."
              className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none text-lg"
            />
            <button 
              onClick={handleSearch}
              className="ml-4 text-[#E3D010] hover:scale-110 transition-transform flex-shrink-0"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 16V8C21 6.89543 20.1046 6 19 6H5C3.89543 6 3 6.89543 3 8V16C3 17.1046 3.89543 18 5 18H19C20.1046 18 21 17.1046 21 16Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="opacity-0" /* Hiding standard mail icon, drawing a custom sparkle cursor */
                />
                <path
                  d="M10 13L12 17L14 13L18 11L14 9L12 5L10 9L6 11L10 13Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M19 4L20.5 5.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M19 18L20.5 16.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Chips / Tags */}
        <div className="flex flex-wrap justify-center gap-4 max-w-[850px]">
          {uniqueSuggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => setQuery(suggestion)}
              className="px-5 py-3 rounded-full border border-gray-600 bg-transparent text-gray-400 text-[13px] md:text-sm hover:text-white hover:border-[#E3D010] hover:bg-[#111111] transition-all duration-300"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
