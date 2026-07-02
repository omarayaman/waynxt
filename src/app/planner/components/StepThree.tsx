"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useTripStore } from "@/store/useTripStore";
import { useAuthStore } from "@/store/useAuthStore";
import { tripService } from "@/services/trip.service";
import { buildCreateTripInput } from "@/lib/trip-mappers";
import { TRIP_CREATE_TIMEOUT_MS } from "@/lib/api-errors";
import { Snowflake, Flower2, Sun, Leaf } from "lucide-react";
import OptionCard from "./OptionCard";
import StepSection from "./StepSection";
import StepFooter from "./StepFooter";

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
    { id: "Winter", label: "Winter", desc: "Dec–Feb", icon: <Snowflake size={18} strokeWidth={1.5} /> },
    { id: "Spring", label: "Spring", desc: "Mar–May", icon: <Flower2 size={18} strokeWidth={1.5} /> },
    { id: "Summer", label: "Summer", desc: "Jun–Aug", icon: <Sun size={18} strokeWidth={1.5} /> },
    { id: "Autumn", label: "Autumn", desc: "Sep–Nov", icon: <Leaf size={18} strokeWidth={1.5} /> },
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

      const { trip, isMock, mockReason } = await tripService.createTrip(input);

      if (isMock) {
        const mockMessages: Record<string, string> = {
          timeout: `السيرفر لم يرد خلال ${Math.round(TRIP_CREATE_TIMEOUT_MS / 1000)} ثانية — بيانات تجريبية وهمية`,
          unreachable: 'تعذر الاتصال بالسيرفر — بيانات تجريبية وهمية',
          server: 'السيرفر غير متاح حالياً — بيانات تجريبية وهمية',
        };
        toast.warning(mockMessages[mockReason ?? 'unreachable'] ?? mockMessages.unreachable, {
          duration: 6000,
        });
      } else {
        toast.success("Trip plan created successfully!");
      }

      reset();
      router.push(`/planner/${trip.id}${isMock ? "?mock=1" : ""}`);
    } catch {
      setError("Something went wrong. Please try again.");
      toast.error("Failed to create trip plan");
    } finally {
      setIsCreating(false);
    }
  };

  const minDate = new Date().toISOString().split("T")[0];

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex-1 min-h-0 space-y-4 overflow-y-auto">
        <StepSection title="When are you travelling?" subtitle="Pick your start date and season.">
          <div className="space-y-3">
            <div>
              <label htmlFor="start-date" className="block text-xs text-gray-400 mb-1.5">
                Start date
              </label>
              <input
                id="start-date"
                type="date"
                min={minDate}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/25 px-4 py-2.5 text-sm text-white outline-none focus:border-[#F7EA00]/50"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
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

        <StepSection title="How many days?" subtitle="Slide to set your trip length.">
          <div className="rounded-xl border border-white/10 bg-black/25 px-4 sm:px-6 py-5">
            <div className="text-center mb-4">
              <span className="text-4xl font-clash font-bold text-[#F7EA00]">{journeyLength}</span>
              <span className="text-sm text-gray-400 ml-2">days</span>
            </div>

            <input
              type="range"
              min="1"
              max="14"
              value={journeyLength}
              onChange={(e) => setJourneyLength(Number(e.target.value))}
              className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer outline-none"
              style={{
                background: `linear-gradient(to right, #F7EA00 0%, #F7EA00 ${
                  ((journeyLength - 1) / 13) * 100
                }%, #374151 ${((journeyLength - 1) / 13) * 100}%, #374151 100%)`,
              }}
            />

            <style
              dangerouslySetInnerHTML={{
                __html: `
                  input[type=range]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: #F7EA00;
                    cursor: pointer;
                    box-shadow: 0 0 10px rgba(247, 234, 0, 0.45);
                  }
                  input[type=range]::-moz-range-thumb {
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: #F7EA00;
                    cursor: pointer;
                    border: none;
                    box-shadow: 0 0 10px rgba(247, 234, 0, 0.45);
                  }
                `,
              }}
            />

            <div className="flex justify-between text-xs text-gray-500 mt-3 font-medium">
              <span>1 day</span>
              <span>2 weeks</span>
            </div>
          </div>
        </StepSection>

        <StepSection title="Travelers" subtitle="How many people are going?">
          <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-black/25 px-4 py-3">
            <button
              type="button"
              onClick={() => setTravelersCount(Math.max(1, travelersCount - 1))}
              className="w-9 h-9 rounded-lg border border-white/10 text-white hover:bg-white/5 transition-colors"
            >
              −
            </button>
            <span className="text-2xl font-clash font-bold text-[#F7EA00] flex-1 text-center">
              {travelersCount}
            </span>
            <button
              type="button"
              onClick={() => setTravelersCount(Math.min(20, travelersCount + 1))}
              className="w-9 h-9 rounded-lg border border-white/10 text-white hover:bg-white/5 transition-colors"
            >
              +
            </button>
          </div>
        </StepSection>
      </div>

      {error && (
        <p className="text-red-400 text-sm shrink-0">{error}</p>
      )}

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
