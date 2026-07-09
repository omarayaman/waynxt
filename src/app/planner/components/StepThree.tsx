"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CalendarDays, Loader2, Minus, Plus, Users } from "lucide-react";
import { useTripStore } from "@/store/useTripStore";
import { useAuthStore } from "@/store/useAuthStore";
import { tripService } from "@/services/trip.service";
import { buildCreateTripInput } from "@/lib/trip-mappers";
import { Snowflake, Flower2, Sun, Leaf } from "lucide-react";
import OptionCard from "./OptionCard";
import StepSection from "./StepSection";
import StepFooter from "./StepFooter";

function TripDurationTravelers({
  journeyLength,
  setJourneyLength,
  travelersCount,
  setTravelersCount,
}: {
  journeyLength: number;
  setJourneyLength: (value: number) => void;
  travelersCount: number;
  setTravelersCount: (value: number) => void;
}) {
  const rangePercent = ((journeyLength - 1) / 13) * 100;

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface dark:border-white/10 dark:bg-black/25">
      <div className="grid grid-cols-1 sm:grid-cols-2 sm:divide-x sm:divide-border dark:sm:divide-white/10">
        <div className="p-3 sm:p-3.5">
          <div className="mb-2.5 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-surface-elevated text-muted dark:border-white/10 dark:bg-black/30 dark:text-gray-400">
              <CalendarDays size={14} strokeWidth={1.75} />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground dark:text-white">How many days?</p>
              <p className="text-[11px] text-muted dark:text-gray-400">Slide to set length</p>
            </div>
          </div>

          <div className="flex items-end justify-between gap-3">
            <div className="flex items-baseline gap-1">
              <span className="font-clash text-2xl font-bold tabular-nums leading-none text-foreground dark:text-accent">
                {journeyLength}
              </span>
              <span className="pb-0.5 text-xs text-muted dark:text-gray-400">days</span>
            </div>
            <span className="pb-0.5 text-[10px] font-medium text-muted dark:text-gray-500">1 – 14</span>
          </div>

          <input
            type="range"
            min="1"
            max="14"
            value={journeyLength}
            onChange={(e) => setJourneyLength(Number(e.target.value))}
            aria-label="Trip length in days"
            className="planner-range planner-range-track mt-2.5 h-1.5 w-full cursor-pointer appearance-none rounded-full outline-none"
          />
        </div>

        <div className="border-t border-border p-3 sm:border-t-0 sm:p-3.5 dark:border-white/10">
          <div className="mb-2.5 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-surface-elevated text-muted dark:border-white/10 dark:bg-black/30 dark:text-gray-400">
              <Users size={14} strokeWidth={1.75} />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground dark:text-white">Travelers</p>
              <p className="text-[11px] text-muted dark:text-gray-400">Who is going?</p>
            </div>
          </div>

          <div className="flex h-[52px] items-center justify-between rounded-lg border border-border bg-surface-elevated px-2 dark:border-white/10 dark:bg-black/30">
            <button
              type="button"
              onClick={() => setTravelersCount(Math.max(1, travelersCount - 1))}
              disabled={travelersCount <= 1}
              aria-label="Decrease travelers"
              className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-surface text-foreground disabled:opacity-40 dark:border-white/10 dark:bg-black/25 dark:text-white"
            >
              <Minus size={14} />
            </button>

            <div className="flex flex-col items-center">
              <span className="font-clash text-xl font-bold tabular-nums leading-none text-foreground dark:text-accent">
                {travelersCount}
              </span>
              <span className="mt-0.5 text-[10px] text-muted dark:text-gray-400">
                {travelersCount === 1 ? "person" : "people"}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setTravelersCount(Math.min(20, travelersCount + 1))}
              disabled={travelersCount >= 20}
              aria-label="Increase travelers"
              className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-surface text-foreground disabled:opacity-40 dark:border-white/10 dark:bg-black/25 dark:text-white"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .planner-range-track {
              background: linear-gradient(to right, var(--foreground) 0%, var(--foreground) ${rangePercent}%, var(--border) ${rangePercent}%, var(--border) 100%);
            }
            .dark .planner-range-track {
              background: linear-gradient(to right, var(--accent) 0%, var(--accent) ${rangePercent}%, #374151 ${rangePercent}%, #374151 100%);
            }
            .planner-range::-webkit-slider-thumb {
              -webkit-appearance: none;
              appearance: none;
              width: 14px;
              height: 14px;
              border-radius: 50%;
              background: var(--foreground);
              cursor: pointer;
              border: 2px solid var(--surface);
            }
            .planner-range::-moz-range-thumb {
              width: 14px;
              height: 14px;
              border-radius: 50%;
              background: var(--foreground);
              cursor: pointer;
              border: 2px solid var(--surface);
            }
            .dark .planner-range::-webkit-slider-thumb {
              background: var(--accent);
              border-color: #0a0a0a;
              box-shadow: 0 0 10px rgba(247, 234, 0, 0.45);
            }
            .dark .planner-range::-moz-range-thumb {
              background: var(--accent);
              border-color: #0a0a0a;
              box-shadow: 0 0 10px rgba(247, 234, 0, 0.45);
            }
          `,
        }}
      />
    </div>
  );
}

export default function StepThree() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const {
    season,
    setSeason,
    journeyLength,
    setJourneyLength,
    startDate,
    setStartDate,
    travelersCount,
    setTravelersCount,
    interests,
    whoIsTraveling,
    budget,
    ageGroup,
    crowdPreference,
    isCreating,
    setIsCreating,
    prevStep,
    reset,
  } = useTripStore();

  const [error, setError] = useState("");

  const seasonOptions = [
    { id: "Winter", label: "Winter", desc: "Dec–Feb", icon: <Snowflake size={16} strokeWidth={1.5} /> },
    { id: "Spring", label: "Spring", desc: "Mar–May", icon: <Flower2 size={16} strokeWidth={1.5} /> },
    { id: "Summer", label: "Summer", desc: "Jun–Aug", icon: <Sun size={16} strokeWidth={1.5} /> },
    { id: "Autumn", label: "Autumn", desc: "Sep–Nov", icon: <Leaf size={16} strokeWidth={1.5} /> },
  ];

  const handleBuildPlan = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to create a trip plan");
      router.push("/login?redirect=/planner");
      return;
    }

    setError("");
    setIsCreating(true);

    try {
      const input = buildCreateTripInput({
        startDate,
        journeyLength,
        travelersCount,
        interests,
        whoIsTraveling,
        budget,
        ageGroup,
        crowdPreference,
        season,
      });

      const { trip } = await tripService.createTrip(input);

      toast.success("Trip plan created successfully!");

      reset();
      router.push(`/planner/${trip.id}`);
    } catch {
      setError("Something went wrong. Please try again.");
      toast.error("Failed to create trip plan");
    } finally {
      setIsCreating(false);
    }
  };

  const minDate = new Date().toISOString().split("T")[0];

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto">
        <StepSection title="When are you travelling?" subtitle="Pick your start date and season.">
          <div className="space-y-2.5">
            <div>
              <label htmlFor="start-date" className="mb-1 block text-xs text-muted">
                Start date
              </label>
              <input
                id="start-date"
                type="date"
                min={minDate}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-foreground outline-none focus:border-foreground/40 dark:border-white/10 dark:bg-black/25 dark:text-white dark:focus:border-accent/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {seasonOptions.map((option) => (
                <OptionCard
                  key={option.id}
                  {...option}
                  isActive={season === option.id}
                  onClick={() => setSeason(option.id)}
                  compact
                />
              ))}
            </div>
          </div>
        </StepSection>

        <TripDurationTravelers
          journeyLength={journeyLength}
          setJourneyLength={setJourneyLength}
          travelersCount={travelersCount}
          setTravelersCount={setTravelersCount}
        />
      </div>

      {error && <p className="shrink-0 text-sm text-red-400">{error}</p>}

      <StepFooter
        onBack={prevStep}
        onContinue={handleBuildPlan}
        continueLabel={
          isCreating ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 size={16} className="animate-spin" />
              Building…
            </span>
          ) : (
            "Build my plan"
          )
        }
        continueDisabled={!season || !startDate || isCreating}
      />
    </div>
  );
}
