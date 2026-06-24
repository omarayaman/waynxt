import React from "react";
import { User, Heart, Users, UsersRound } from "lucide-react";
import { useJourneyStore } from "@/store/useJourneyStore";

export default function WhoIsTravelingCard() {
  const { whoIsTraveling, setWhoIsTraveling } = useJourneyStore();

  const options = [
    { id: "Solo", label: "Solo", subtext: "Just me", icon: <User size={28} strokeWidth={1.5} /> },
    { id: "Couple", label: "Couple", subtext: "Romantic escape", icon: <Heart size={28} strokeWidth={1.5} /> },
    { id: "Family", label: "Family", subtext: "With kids or parents", icon: <Users size={28} strokeWidth={1.5} /> },
    { id: "Friends", label: "Friends", subtext: "Group adventure", icon: <UsersRound size={28} strokeWidth={1.5} /> },
  ];

  return (
    <div className="bg-[#0A0A0A] rounded-2xl border border-gray-800 p-6 flex flex-col w-full h-full">
      <div className="flex items-center gap-2 mb-6">
        <Users className="text-[#DFD616]" size={20} />
        <h3 className="text-base font-bold text-[#DFD616]">
          Who's Coming Along?
        </h3>
      </div>
      
      <div className="grid grid-cols-2 gap-4 w-full h-full">
        {options.map((option) => {
          const isActive = whoIsTraveling === option.id;
          
          return (
            <button
              key={option.id}
              onClick={() => setWhoIsTraveling(option.id)}
              className={`rounded-xl border transition-all duration-200 flex flex-col items-center justify-center text-center gap-2 p-5 ${
                isActive
                  ? "bg-[#DFD616] text-[#0a0a0a] font-bold border-transparent"
                  : "bg-transparent text-gray-400 font-medium border-gray-800 hover:bg-white/5"
              }`}
            >
              <div className="mb-1">{option.icon}</div>
              <span className="text-base tracking-wide">
                {option.label}
              </span>
              <span className={`text-sm font-normal ${isActive ? "text-gray-800" : "text-gray-400"}`}>
                {option.subtext}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
