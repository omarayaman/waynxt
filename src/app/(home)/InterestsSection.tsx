"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";
import { useCategories } from "@/hooks/useCategories";
import { getCategoryImageUrl } from "@/lib/public-assets";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

const AUTOPLAY_DELAY = 4500;

export default function InterestsSection() {
  const { categories, isLoading } = useCategories();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      skipSnaps: false,
      dragFree: true,
      containScroll: "trimSnaps",
    },
    [
      Autoplay({
        delay: AUTOPLAY_DELAY,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
        playOnInit: true,
      }),
    ]
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi]
  );

  useEffect(() => {
    if (!emblaApi) return;

    const syncSelection = (): void => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("select", syncSelection);
    emblaApi.on("reInit", syncSelection);

    return () => {
      emblaApi.off("select", syncSelection);
      emblaApi.off("reInit", syncSelection);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (emblaApi && categories.length > 0) {
      emblaApi.reInit();
    }
  }, [emblaApi, categories.length]);

  return (
    <section className="w-full bg-background py-10 px-4 flex flex-col items-center">
      <div className="max-w-[1300px] w-full flex flex-col items-center relative">
        <h2 className="text-4xl md:text-[44px] font-bold text-foreground mb-4 text-center">
          Explore by interest
        </h2>
        <p className="text-muted text-base md:text-lg text-center mb-3">
          Discover Egypt through different travel experiences.
        </p>

        {isLoading ? (
          <div className="flex justify-center items-center w-full h-[380px]">
            <Loader2 size={40} className="animate-spin text-accent" />
          </div>
        ) : categories.length === 0 ? (
          <p className="text-muted text-center">No categories available.</p>
        ) : (
          <div className="w-full relative group/carousel">
            {/* Navigation */}
            <button
              type="button"
              onClick={scrollPrev}
              aria-label="Previous interests"
              className="absolute -left-2 md:-left-5 top-1/2 -translate-y-1/2 w-11 h-11 md:w-12 md:h-12 rounded-full bg-surface/90 border border-border text-foreground items-center justify-center z-10 backdrop-blur-md opacity-70 md:opacity-0 md:group-hover/carousel:opacity-100 transition-all duration-300 hover:bg-surface-elevated hover:scale-110 hover:border-accent/40 shadow-xl hidden sm:flex"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              aria-label="Next interests"
              className="absolute -right-2 md:-right-5 top-1/2 -translate-y-1/2 w-11 h-11 md:w-12 md:h-12 rounded-full bg-surface/90 border border-border text-foreground items-center justify-center z-10 backdrop-blur-md opacity-70 md:opacity-0 md:group-hover/carousel:opacity-100 transition-all duration-300 hover:bg-surface-elevated hover:scale-110 hover:border-accent/40 shadow-xl hidden sm:flex"
            >
              <ChevronRight size={24} />
            </button>

            {/* Carousel viewport */}
            <div className="overflow-hidden px-1 py-6" ref={emblaRef}>
              <div className="flex touch-pan-y -ml-6 py-10">
                {categories.map((interest) => (
                  <div
                    key={interest.category}
                    className="min-w-0 shrink-0 grow-0 basis-[280px] md:basis-[300px] pl-6"
                  >
                    <Link
                      href={`/places?category=${interest.category.toLowerCase()}`}
                      className="group/card relative h-[380px] w-full rounded-2xl overflow-hidden cursor-pointer block shadow-lg transition-shadow duration-500 hover:shadow-[0_20px_50px_rgba(227,208,16,0.15)]"
                    >
                      <Image
                        src={getCategoryImageUrl({
                          category: interest.category,
                          imageUrl: interest.image_url,
                        })}
                        alt={interest.category}
                        fill
                        sizes="(max-width: 768px) 280px, 300px"
                        className="object-cover transition-transform duration-700 ease-out group-hover/card:scale-110 
                        opacity-85 group-hover/card:opacity-95"
                      />

                      <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/30 to-transparent transition-opacity 
                      duration-300 group-hover/card:opacity-90" />

                      <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col items-center text-center translate-y-6 transition-transform duration-500 ease-out group-hover/card:translate-y-0">
                        <h3 className="text-white font-bold text-xl mb-3 capitalize">
                          {interest.category}
                        </h3>

                        <div className="w-full max-w-[180px] h-[2px] bg-accent scale-x-0 origin-center transition-transform duration-500 ease-out group-hover/card:scale-x-100" />

                        <span className="text-accent font-medium text-sm mt-3 opacity-0 transition-all duration-500 group-hover/card:opacity-100 flex items-center gap-1">
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
                            className="transition-transform duration-300 group-hover/card:translate-x-1"
                          >
                            <path d="M5 12h14" />
                            <path d="m12 5 7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination dots */}
            {categories.length > 1 && (
              <div className="flex justify-center items-center gap-2">
                {categories.map((interest, index) => (
                  <button
                    key={interest.category}
                    type="button"
                    aria-label={`Go to ${interest.category}`}
                    aria-current={index === selectedIndex ? "true" : undefined}
                    onClick={() => scrollTo(index)}
                    className={`h-2 rounded-full transition-all duration-500 ease-out ${
                      index === selectedIndex
                        ? "w-8 bg-accent"
                        : "w-2 bg-foreground/20 hover:bg-foreground/40"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
