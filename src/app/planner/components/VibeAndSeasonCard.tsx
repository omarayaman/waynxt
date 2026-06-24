import React from "react";
import { Smile, Calendar, Sparkles, Scale, Moon, Snowflake, Flower2, Sun, Leaf } from "lucide-react";
import { useJourneyStore } from "@/store/useJourneyStore";

export default function VibeAndSeasonCard() {
  const { crowdPreference, setCrowdPreference, season, setSeason } = useJourneyStore();

  const crowdOptions = [
    { id: "Lively", label: "Lively", icon: <Sparkles size={20} /> },
    { id: "No Pref", label: "No Pref", icon: <Scale size={20} /> },
    { id: "Peaceful", label: "Peaceful", icon: <Moon size={20} /> },
  ];

  const seasonOptions = [
    { id: "Winter", label: "Winter", icon: <Snowflake size={20} /> },
    { id: "Spring", label: "Spring", icon: <Flower2 size={20} /> },
    { id: "Summer", label: "Summer", icon: <Sun size={20} /> },
    { id: "Autumn", label: "Autumn", icon: <Leaf size={20} /> },
  ];

  return (
    <div className="bg-[#0A0A0A] rounded-2xl border border-gray-800 p-6 flex flex-col w-full h-full gap-8">
      {/* Crowd Preference Section */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2 mb-6">
          <Smile className="text-[#DFD616]" size={20} />
          <h3 className="text-base font-bold text-[#DFD616]">
            Trip Vibe?
          </h3>
        </div>
        <div className="flex flex-wrap gap-3">
          {crowdOptions.map((option) => {
            const isActive = crowdPreference === option.id;
            return (
              <button
                key={option.id}
                onClick={() => setCrowdPreference(option.id)}
                className={`rounded-full border px-5 py-3 transition-all duration-200 text-base flex items-center gap-2 flex-1 justify-center ${
                  isActive
                    ? "bg-[#DFD616] text-[#0a0a0a] font-bold border-transparent"
                    : "bg-transparent text-gray-400 font-medium border-gray-800 hover:bg-white/5"
                }`}
              >
                {option.icon}
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-gray-800"></div>

      {/* Season Section */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="text-[#DFD616]" size={20} />
          <h3 className="text-base font-bold text-[#DFD616]">
            Which Season?
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {seasonOptions.map((option) => {
            const isActive = season === option.id;
            return (
              <button
                key={option.id}
                onClick={() => setSeason(option.id)}
                className={`rounded-xl border p-4 transition-all duration-200 flex items-center gap-3 ${
                  isActive
                    ? "bg-[#DFD616] text-[#0a0a0a] font-bold border-transparent"
                    : "bg-transparent text-gray-400 font-medium border-gray-800 hover:bg-white/5"
                }`}
              >
                {option.icon}
                <span className="text-base">{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
