import React from "react";
import { UsersRound, Backpack, User, Glasses } from "lucide-react";
import { useJourneyStore } from "@/store/useJourneyStore";

export default function AgeGroupCard() {
  const { ageGroup, setAgeGroup } = useJourneyStore();

  const options = [
    { id: "Teen", label: "Teen", subtext: "Under 20", icon: <Backpack size={24} strokeWidth={1.5} /> },
    { id: "Adult", label: "Adult", subtext: "20–60 years", icon: <User size={24} strokeWidth={1.5} /> },
    { id: "Senior", label: "Senior", subtext: "60+ years", icon: <Glasses size={24} strokeWidth={1.5} /> },
  ];

  return (
    <div className="bg-[#0A0A0A] rounded-2xl border border-gray-800 p-6 flex flex-col w-full">
      <div className="flex items-center gap-2 mb-6">
        <UsersRound className="text-[#DFD616]" size={20} />
        <h3 className="text-base font-bold text-[#DFD616]">
          Age Group
        </h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
        {options.map((option) => {
          const isActive = ageGroup === option.id;
          
          return (
            <button
              key={option.id}
              onClick={() => setAgeGroup(option.id)}
              className={`rounded-xl border transition-all duration-200 flex items-center p-5 gap-4 ${
                isActive
                  ? "bg-[#DFD616] text-[#0a0a0a] border-transparent"
                  : "bg-transparent text-gray-400 border-gray-800 hover:bg-white/5"
              }`}
            >
              <div>{option.icon}</div>
              <div className="flex flex-col items-start">
                <span className={`text-base tracking-wide ${isActive ? "font-bold" : "font-medium"}`}>
                  {option.label}
                </span>
                <span className={`text-sm font-normal mt-0.5 ${isActive ? "text-[#0a0a0a]" : "text-gray-400"}`}>
                  {option.subtext}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
