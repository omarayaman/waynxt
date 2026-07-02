import React from "react";
import { useTripStore } from "@/store/useTripStore";
import { Snowflake, Flower2, Sun, Leaf } from "lucide-react";
import OptionCard from "./OptionCard";
import StepSection from "./StepSection";
import StepFooter from "./StepFooter";

export default function StepThree() {
  const { season, setSeason, journeyLength, setJourneyLength, prevStep } = useTripStore();

  const seasonOptions = [
    { id: "Winter", label: "Winter", desc: "Dec–Feb", icon: <Snowflake size={18} strokeWidth={1.5} /> },
    { id: "Spring", label: "Spring", desc: "Mar–May", icon: <Flower2 size={18} strokeWidth={1.5} /> },
    { id: "Summer", label: "Summer", desc: "Jun–Aug", icon: <Sun size={18} strokeWidth={1.5} /> },
    { id: "Autumn", label: "Autumn", desc: "Sep–Nov", icon: <Leaf size={18} strokeWidth={1.5} /> },
  ];

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex-1 min-h-0 space-y-4 overflow-hidden">
        <StepSection title="When are you travelling?" subtitle="Season affects which places are at their best.">
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
      </div>

      <StepFooter
        onBack={prevStep}
        onContinue={() => alert("Trip generated! Check Zustand store for data.")}
        continueLabel="Build my plan"
        continueDisabled={!season}
      />
    </div>
  );
}
