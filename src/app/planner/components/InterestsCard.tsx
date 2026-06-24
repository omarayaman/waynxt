import React from "react";
import { Compass } from "lucide-react";
import { useJourneyStore } from "@/store/useJourneyStore";

export default function InterestsCard() {
  const { interests, toggleInterest } = useJourneyStore();

  const options = [
    { id: "History", label: "History" },
    { id: "Beach", label: "Beach" },
    { id: "Food", label: "Food" },
    { id: "Wellness", label: "Wellness" },
    { id: "Religious", label: "Religious" },
    { id: "Nature", label: "Nature" },
    { id: "Adventure", label: "Adventure" },
  ];

  return (
    <div className="bg-[#0A0A0A] rounded-2xl border border-gray-800 p-6 flex flex-col w-full h-full">
      <div className="flex items-center gap-2 mb-6">
        <Compass className="text-[#DFD616]" size={20} />
        <h3 className="text-base font-bold text-[#DFD616]">
          What Excites You?
        </h3>
      </div>
      
      <div className="flex flex-wrap gap-3">
        {options.map((option) => {
          const isActive = interests.includes(option.id);
          
          return (
            <button
              key={option.id}
              onClick={() => toggleInterest(option.id)}
              className={`rounded-full border px-5 py-3 transition-all duration-200 text-base ${
                isActive
                  ? "bg-[#DFD616] text-[#0a0a0a] font-bold border-transparent"
                  : "bg-transparent text-gray-400 font-medium border-gray-800 hover:bg-white/5"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
