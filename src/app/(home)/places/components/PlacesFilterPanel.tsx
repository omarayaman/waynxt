"use client";

import React, { useMemo, useState } from "react";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { usePlacesStore } from "@/store/usePlacesStore";
import {
  BUDGET_LEVELS,
  CROWD_LEVELS,
  SEASONS,
  SUITABLE_AGES,
  SUITABLE_FOR,
} from "../constants";

const INITIAL_CITY_COUNT = 5;

interface PlacesFilterPanelProps {
  cities: string[];
  citiesLoading?: boolean;
  onApply?: () => void;
  showApplyButton?: boolean;
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="py-3 first:pt-0">
      <h3 className="text-[10px] font-medium text-[var(--navbar-muted)] uppercase tracking-wider mb-2">{title}</h3>
      {children}
    </div>
  );
}

function Chip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-2 py-1 rounded-md text-[11px] transition-colors ${
        active
          ? "bg-accent-subtle text-accent ring-1 ring-accent/40"
          : "text-[var(--navbar-muted)] hover:text-[var(--navbar-foreground)] ring-1 ring-black/15 hover:ring-accent/30"
      }`}
    >
      {label}
    </button>
  );
}

function CityList({ cities, loading }: { cities: string[]; loading?: boolean }) {
  const { activeCities, toggleCity } = usePlacesStore();
  const [expanded, setExpanded] = useState(false);

  const sortedCities = useMemo(() => {
    const selected = cities.filter((c) => activeCities.includes(c));
    const rest = cities.filter((c) => !activeCities.includes(c));
    return [...selected, ...rest];
  }, [cities, activeCities]);

  const hasMore = sortedCities.length > INITIAL_CITY_COUNT;
  const visibleCities = expanded ? sortedCities : sortedCities.slice(0, INITIAL_CITY_COUNT);
  const hiddenCount = sortedCities.length - INITIAL_CITY_COUNT;

  if (loading) {
    return (
      <div className="space-y-1.5">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-4 w-20 rounded bg-black/10 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-1">
        {visibleCities.map((city) => {
          const isActive = activeCities.includes(city);
          return (
            <button
              key={city}
              type="button"
              onClick={() => toggleCity(city)}
              className="flex items-center gap-2 text-left py-0.5 group"
            >
              <span
                className={`w-3 h-3 rounded-sm border flex items-center justify-center shrink-0 transition-colors ${
                  isActive
                    ? "border-accent bg-accent"
                    : "border-black/20 group-hover:border-accent/50"
                }`}
              >
                {isActive && <Check size={8} className="text-accent-foreground stroke-[3]" />}
              </span>
              <span className={`text-xs ${isActive ? "text-[var(--navbar-foreground)] font-medium" : "text-[var(--navbar-muted)]"}`}>
                {city}
              </span>
            </button>
          );
        })}
      </div>

      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="mt-2 flex items-center gap-1 text-[11px] text-[var(--navbar-muted)] transition-colors hover:text-[var(--navbar-foreground)]"
        >
          {expanded ? (
            <>
              Show less <ChevronUp size={12} />
            </>
          ) : (
            <>
              Show {hiddenCount} more <ChevronDown size={12} />
            </>
          )}
        </button>
      )}
    </div>
  );
}

export function PlacesFilterPanel({
  cities,
  citiesLoading,
  onApply,
  showApplyButton,
}: PlacesFilterPanelProps) {
  const {
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
  } = usePlacesStore();

  return (
    <div className="flex flex-col">
      <div>
        <FilterSection title="City">
          <CityList cities={cities} loading={citiesLoading} />
        </FilterSection>

        <FilterSection title="Budget">
          <div className="flex flex-wrap gap-1.5">
            {BUDGET_LEVELS.map((b) => (
              <Chip
                key={b.id}
                label={b.label}
                active={activeBudgets.includes(b.id)}
                onClick={() => toggleBudget(b.id)}
              />
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Travel style">
          <div className="flex flex-wrap gap-1.5">
            {SUITABLE_FOR.map((s) => (
              <Chip
                key={s.id}
                label={s.label}
                active={activeSuitableFor === s.id}
                onClick={() => setSuitableFor(s.id)}
              />
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Age">
          <div className="flex flex-wrap gap-1.5">
            {SUITABLE_AGES.map((a) => (
              <Chip
                key={a.id}
                label={a.label}
                active={activeAge === a.id}
                onClick={() => setAge(a.id)}
              />
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Season">
          <div className="flex flex-wrap gap-1.5">
            {SEASONS.map((s) => (
              <Chip
                key={s.id}
                label={s.label}
                active={activeSeason === s.id}
                onClick={() => setSeason(s.id)}
              />
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Crowd">
          <div className="flex flex-wrap gap-1.5">
            {CROWD_LEVELS.map((c) => (
              <Chip
                key={c.id}
                label={c.label}
                active={activeCrowdLevel === c.id}
                onClick={() => setCrowdLevel(c.id)}
              />
            ))}
          </div>
        </FilterSection>
      </div>

      {showApplyButton && onApply && (
        <button
          type="button"
          onClick={onApply}
          className="mt-4 w-full py-2 rounded-lg bg-accent text-accent-foreground text-xs font-medium hover:bg-accent-hover transition-colors"
        >
          Apply
        </button>
      )}
    </div>
  );
}
