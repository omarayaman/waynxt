"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCategories } from "@/hooks/useCategories";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

export default function InterestsSection() {
  const { categories, isLoading } = useCategories();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -400, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 400, behavior: "smooth" });
    }
  };

  return (
    <section className="w-full bg-[#050505] py-20 px-4 flex flex-col items-center">
      <div className="max-w-[1300px] w-full flex flex-col items-center relative">
        <h2 className="text-4xl md:text-[44px] font-bold text-white mb-4 text-center">
          Explore by interest
        </h2>
        <p className="text-gray-400 text-base md:text-lg text-center mb-16">
          Discover Egypt through different travel experiences.
        </p>

        {isLoading ? (
          <div className="flex justify-center items-center w-full h-[380px]">
            <Loader2 size={40} className="animate-spin text-[#E3D010]" />
          </div>
        ) : (
          <div className="w-full relative group">
            
            {/* Scroll Navigation Buttons */}
            <button 
              onClick={scrollLeft}
              className="absolute -left-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 border border-white/10 text-white flex items-center justify-center z-10 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80 hover:scale-110 shadow-xl hidden md:flex"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={scrollRight}
              className="absolute -right-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 border border-white/10 text-white flex items-center justify-center z-10 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80 hover:scale-110 shadow-xl hidden md:flex"
            >
              <ChevronRight size={24} />
            </button>

            {/* Carousel Container */}
            <div 
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-8 pt-4 px-2 custom-scrollbar hide-scrollbar"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {categories.map((interest) => (
                <Link
                  key={interest.category}
                  href={`/places?category=${interest.category.toLowerCase()}`}
                  className="group/card relative h-[380px] min-w-[280px] max-w-[280px] md:min-w-[300px] md:max-w-[300px] rounded-2xl overflow-hidden cursor-pointer block snap-center shrink-0 shadow-lg"
                >
                  {/* Background Image */}
                  <Image
                    src={interest.image_url || "/images/history.png"}
                    alt={interest.category}
                    fill
                    className="object-cover transition-transform duration-700 group-hover/card:scale-110"
                  />

                  {/* Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition-opacity duration-300 group-hover/card:opacity-90"></div>

                  {/* Content Container */}
                  <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col items-center text-center translate-y-6 transition-transform duration-300 group-hover/card:translate-y-0">
                    <h3 className="text-white font-bold text-xl mb-3 capitalize">
                      {interest.category}
                    </h3>
                    
                    {/* Yellow Line */}
                    <div className="w-full max-w-[180px] h-[2px] bg-[#E3D010] scale-x-0 origin-center transition-transform duration-300 group-hover/card:scale-x-100"></div>
                    
                    {/* Explore Text */}
                    <span className="text-[#E3D010] font-medium text-sm mt-3 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100 flex items-center gap-1">
                      Explore
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="group-hover/card:translate-x-1 transition-transform"
                      >
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            
            <style dangerouslySetInnerHTML={{ __html: `
              .hide-scrollbar::-webkit-scrollbar {
                display: none;
              }
            `}} />
          </div>
        )}
      </div>
    </section>
  );
}
