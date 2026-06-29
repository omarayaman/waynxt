"use client";

import React, { useState, useEffect } from "react";
import NavbarHome from "../NavbarHome";
import { useRouter } from "next/navigation";
import {
  Search,
  TrendingUp,
  ScrollText,
  Landmark,
  TreePine,
  MapPin,
  X,
  Loader2,
  Tent,
  Sun,
  Building2,
  Utensils,
  Activity,
  Diamond,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { placesService } from "@/services/places.service";
import { useCategories } from "@/hooks/useCategories";
import { Place } from "@/types/places";
import Image from "next/image";

const TRENDING_TAGS = [
  "Pyramids of Giza",
  "Abu Simbel Temples",
  "White Desert",
  "Hot Air Balloon over Luxor",
  "White Desert Camping",
  "Karnak Temple",
  "Valley of the Kings",
  "Grand Egyptian Museum",
];

export default function SearchPage() {
  const router = useRouter();
  const { categories, isLoading: isLoadingCategories } = useCategories();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch results when debounced query changes
  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedQuery.trim()) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await placesService.searchPlaces(debouncedQuery);
        setSearchResults(response.data || []);
      } catch (error) {
        console.error("Failed to search places", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/places?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const getDropdownIcon = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes("museum")) return <Landmark size={18} />;
    if (cat.includes("history")) return <ScrollText size={18} />;
    return <MapPin size={18} />;
  };

  const getCategoryIconComponent = (category: string) => {
    switch (category.toLowerCase()) {
      case "history":
        return Landmark;
      case "adventure":
        return Tent;
      case "beach":
        return Sun;
      case "nature":
        return TreePine;
      case "religious":
        return Building2;
      case "food":
        return Utensils;
      case "wellness":
        return Activity;
      default:
        return Diamond;
    }
  };

  const hasResultsOrQuery = searchQuery.trim().length > 0;

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex flex-col">
      <NavbarHome />

      <main className="flex-1 w-full px-6 pt-24 pb-24 relative z-10 flex flex-col items-center">
        {/* Header Text */}
        <div className="text-center mt-4 md:mt-6 mb-10">
          <h1 className="text-[40px] md:text-[56px] font-medium text-white mb-4">
            Search
          </h1>
          <p className="text-[#888888] text-base md:text-lg">
            Find places, museums, and cultural topics — quickly and clearly.
          </p>
        </div>

        {/* Search Bar Container */}
        <div className="w-full max-w-[800px] relative mb-16">
          <form onSubmit={handleSearch} className="relative z-20">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#666666]">
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Search size={20} strokeWidth={1.5} />
              )}
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search museums, landmarks, history, culture..."
              className={`w-full bg-[#111111] border border-[#222222] py-5 pl-14 pr-12 text-base text-white placeholder:text-[#666666] focus:outline-none focus:border-[#DFD616]/50 transition-colors ${hasResultsOrQuery ? "rounded-t-2xl border-b-[#111111] focus:border-b-[#111111]" : "rounded-2xl"}`}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-[#666666] hover:text-white transition-colors"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            )}
          </form>

          {/* Search Results Dropdown */}
          {hasResultsOrQuery && (
            <div className="absolute top-full left-0 w-full bg-[#1A1A1A] border border-[#222222] border-t-0 rounded-b-2xl overflow-hidden shadow-2xl z-10 flex flex-col max-h-[400px] overflow-y-auto custom-scrollbar">
              {searchResults.length > 0
                ? searchResults.map((place) => (
                    <button
                      key={place.id}
                      onClick={() => router.push(`/places/${place.id}`)}
                      className="w-full flex items-center gap-4 px-6 py-4 hover:bg-[#222222] transition-colors border-b border-[#222222] last:border-b-0 text-left"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#2A280D] flex items-center justify-center text-[#DFD616] shrink-0">
                        {getDropdownIcon(place.category)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-white text-sm font-medium">
                          {place.name}
                        </span>
                        <span className="text-[#888888] text-xs capitalize mt-0.5">
                          {place.category}
                        </span>
                      </div>
                    </button>
                  ))
                : !isLoading && (
                    <div className="px-6 py-8 text-center text-[#888888] text-sm">
                      No results found for &quot;{searchQuery}&quot;
                    </div>
                  )}
            </div>
          )}
        </div>

        {/* Content Container aligned with search bar (Only shows when search is empty) */}
        {!hasResultsOrQuery && (
          <div className="w-full max-w-[800px] flex flex-col gap-16 animate-in fade-in duration-300">
            {/* Trending Section */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp
                  className="text-[#DFD616]"
                  size={18}
                  strokeWidth={2}
                />
                <h2 className="text-[17px] font-medium text-white">Trending</h2>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {TRENDING_TAGS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() =>
                      router.push(`/places?search=${encodeURIComponent(tag)}`)
                    }
                    className="px-4 py-1.5 rounded-full bg-[#131313] border border-[#3a3a3a] text-[#b6b6b6] text-[13px] hover:bg-[#1A1A1A] hover:text-white hover:border-[#333333] transition-all"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </section>

            {/* Browse Categories Section */}
            <section>
              <div className="mb-6">
                <h2 className="text-xl font-medium text-white">
                  Browse categories
                </h2>
              </div>

              {isLoadingCategories ? (
                <div className="w-full flex justify-center py-10">
                  <Loader2 size={32} className="animate-spin text-[#DFD616]" />
                </div>
              ) : (
                <div className="grid grid-cols-3 md:grid-cols-7 gap-2.5">
                  {categories.map((cat) => {
                    const Icon = getCategoryIconComponent(cat.category);
                    return (
                      <button
                        key={cat.category}
                        onClick={() =>
                          router.push(
                            `/places?category=${cat.category.toLowerCase()}`,
                          )
                        }
                        className="flex flex-col items-center gap-2 bg-[#0d0d0a] rounded-xl py-3.5 px-2 hover:bg-[#1A1A1A] transition-colors group"
                      >
                        <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-[#22200A] flex items-center justify-center text-[#DFD616] group-hover:bg-[#2A280D] transition-colors">
                          <Icon size={18} strokeWidth={1.5} />
                        </div>
                        <span className="text-[#CCCCCC] text-[11px] md:text-xs capitalize group-hover:text-white transition-colors">
                          {cat.category}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        )}
      </main>

      <footer className="w-full py-8 text-center text-xs text-[#666666] border-t border-[#1A1A1A] mt-auto">
        <span className="text-[#DFD616]">WAYNX</span> — Immersive travel
        exploration
      </footer>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #111111;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #333333;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #444444;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `,
        }}
      />
    </div>
  );
}
