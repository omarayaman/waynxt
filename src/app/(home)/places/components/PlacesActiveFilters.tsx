"use client";

import { X } from "lucide-react";
import { usePlacesStore } from "@/store/usePlacesStore";

interface ActiveFilter {
  key: string;
  label: string;
  onRemove: () => void;
}

export function PlacesActiveFilters() {
  const {
    search,
    setSearch,
    activeCategory,
    setCategory,
    activeCities,
    toggleCity,
    activeBudgets,
    toggleBudget,
    activeSuitableFor,
    setSuitableFor,
    activeAge,
    setAge,
    activeSeason,
    setSeason,
    activeCrowdLevel,
    setCrowdLevel,
    resetFilters,
  } = usePlacesStore();

  const filters: ActiveFilter[] = [];

  if (search.trim()) {
    filters.push({ key: "search", label: `"${search.trim()}"`, onRemove: () => setSearch("") });
  }
  if (activeCategory && activeCategory !== "all") {
    filters.push({
      key: "category",
      label: activeCategory,
      onRemove: () => setCategory("all"),
    });
  }
  activeCities.forEach((city) => {
    filters.push({ key: `city-${city}`, label: city, onRemove: () => toggleCity(city) });
  });
  activeBudgets.forEach((budget) => {
    filters.push({
      key: `budget-${budget}`,
      label: budget,
      onRemove: () => toggleBudget(budget),
    });
  });
  if (activeSuitableFor) {
    filters.push({
      key: "suitable",
      label: activeSuitableFor,
      onRemove: () => setSuitableFor(activeSuitableFor),
    });
  }
  if (activeAge) {
    filters.push({ key: "age", label: activeAge, onRemove: () => setAge(activeAge) });
  }
  if (activeSeason) {
    filters.push({ key: "season", label: activeSeason, onRemove: () => setSeason(activeSeason) });
  }
  if (activeCrowdLevel) {
    filters.push({
      key: "crowd",
      label: activeCrowdLevel,
      onRemove: () => setCrowdLevel(activeCrowdLevel),
    });
  }

  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {filters.map((filter) => (
        <button
          key={filter.key}
          type="button"
          onClick={filter.onRemove}
          className="inline-flex items-center gap-1 pl-2 pr-1.5 py-0.5 rounded-md dark:bg-accent-subtle bg-white/70 text-[10px] text-muted hover:text-foreground transition-colors capitalize border border-border"
        >
          {filter.label}
          <X size={10} className="text-muted" />
        </button>
      ))}
      <button
        type="button"
        onClick={resetFilters}
        className="text-[10px] text-muted hover:text-accent px-1"
      >
        Clear
      </button>
    </div>
  );
}
