"use client";

import React from "react";
import { Diamond } from "lucide-react";
import { usePlacesStore } from "@/store/usePlacesStore";
import { useCategories } from "@/hooks/useCategories";
import { ALL_EXPERIENCES, CATEGORY_ICONS } from "../constants";

export function PlacesCategoryDock() {
  const { activeCategory, setCategory } = usePlacesStore();
  const { categories, isLoading } = useCategories();

  return (
    <div className="w-full relative min-w-0 pb-2">
      <div className="overflow-x-auto scrollbar-hide w-full">
        <div className="flex items-center gap-2 w-max pr-4">
          {/* All Experiences Button */}
          <button
            onClick={() => setCategory("all")}
            className={`shrink-0 px-4 py-1.5 rounded-full flex items-center gap-2 text-xs md:text-sm font-medium transition-all duration-200 active:scale-95 whitespace-nowrap border ${
              activeCategory === "all" || !activeCategory
                ? "border-[#F7EA00] dark:border-[#F7EA00] text-[#0a0a0a] dark:text-[#0a0a0a] bg-[#F7EA00] dark:bg-[#F7EA00]"
                : "border-gray-200 dark:border-[#222222] text-gray-600 dark:text-[#888888] bg-transparent hover:border-[#F7EA00] dark:hover:border-[#F7EA00] hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <ALL_EXPERIENCES.icon size={14} />
            {ALL_EXPERIENCES.label}
          </button>

          {/* Dynamic Categories */}
          {isLoading ? (
            <div className="flex gap-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-24 h-[34px] rounded-full bg-gray-100 dark:bg-[#111111] border border-gray-200 dark:border-[#222222] animate-pulse"></div>
              ))}
            </div>
          ) : (
            categories.map((cat) => {
              const isActive = activeCategory === cat.category;
              const Icon = CATEGORY_ICONS[cat.category.toLowerCase()] || Diamond;

              return (
                <button
                  key={cat.category}
                  onClick={() => setCategory(cat.category)}
                  className={`shrink-0 px-4 py-1.5 rounded-full flex items-center gap-2 text-xs md:text-sm font-medium transition-all duration-200 active:scale-95 whitespace-nowrap border ${
                    isActive
                      ? "border-[#F7EA00] dark:border-[#F7EA00] text-[#0a0a0a] dark:text-[#0a0a0a] bg-[#F7EA00] dark:bg-[#F7EA00]"
                      : "border-gray-200 dark:border-[#222222] text-gray-600 dark:text-[#888888] bg-transparent hover:border-[#F7EA00] dark:hover:border-[#F7EA00] hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <Icon size={14} />
                  <span className="capitalize">{cat.category}</span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
