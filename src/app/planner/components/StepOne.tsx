import React from "react";
import { useTripStore } from "@/store/useTripStore";
import { Landmark, Umbrella, Utensils, Heart, Church, TreePine, Mountain, User, Users, UsersRound } from "lucide-react";

export default function StepOne() {
  const { interests, toggleInterest, whoIsTraveling, setWhoIsTraveling, nextStep } = useTripStore();

  const interestOptions = [
    { id: "History", label: "History", desc: "Pharaohs & temples", icon: <Landmark size={20} strokeWidth={1.5} /> },
    { id: "Beach", label: "Beach", desc: "Red Sea & Med coast", icon: <Umbrella size={20} strokeWidth={1.5} /> },
    { id: "Food", label: "Food", desc: "Markets & cuisine", icon: <Utensils size={20} strokeWidth={1.5} /> },
    { id: "Wellness", label: "Wellness", desc: "Spas & healing", icon: <Heart size={20} strokeWidth={1.5} /> },
    { id: "Religious", label: "Religious", desc: "Mosques, churches", icon: <Church size={20} strokeWidth={1.5} /> },
    { id: "Nature", label: "Nature", desc: "Deserts & oases", icon: <TreePine size={20} strokeWidth={1.5} /> },
    { id: "Adventure", label: "Adventure", desc: "Diving, hiking", icon: <Mountain size={20} strokeWidth={1.5} /> },
  ];

  const whoOptions = [
    { id: "Solo", label: "Solo", desc: "Just me", icon: <User size={20} strokeWidth={1.5} /> },
    { id: "Couple", label: "Couple", desc: "Romantic escape", icon: <Heart size={20} strokeWidth={1.5} /> },
    { id: "Family", label: "Family", desc: "With kids or parents", icon: <Users size={20} strokeWidth={1.5} /> },
    { id: "Friends", label: "Friends", desc: "Group adventure", icon: <UsersRound size={20} strokeWidth={1.5} /> },
  ];

  return (
    <div className="flex flex-col gap-10 font-poppins text-white">
      {/* What Excites You */}
      <div>
        <h2 className="text-3xl font-bold font-clash mb-2">What excites you?</h2>
        <p className="text-gray-400 mb-6">Select the experiences you&apos;re looking for. Tap as many as you like.</p>
        
        <div className="flex flex-wrap gap-5 md:gap-6">
          {interestOptions.map((option) => {
            const isActive = interests.includes(option.id);
            return (
              <button
                key={option.id}
                onClick={() => toggleInterest(option.id)}
                className={`flex flex-col items-start py-3 px-5 pr-6 rounded-xl border transition-all duration-200 text-left ${
                  isActive
                    ? "border-[#F7EA00] bg-[#1a1a10] shadow-[0_0_15px_rgba(247,234,0,0.1)]"
                    : "border-gray-800 bg-transparent hover:border-gray-600"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className={`transition-colors ${isActive ? "text-[#F7EA00]" : "text-gray-400"}`}>
                    {option.icon}
                  </div>
                  <span className={`text-lg font-bold ${isActive ? "text-[#F7EA00]" : "text-white"}`}>
                    {option.label}
                  </span>
                </div>
                <span className={`text-sm ${isActive ? "text-[#F7EA00]/80" : "text-gray-500"}`}>
                  {option.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Who's coming along */}
      <div>
        <h2 className="text-3xl font-bold font-clash mb-2">Who&apos;s coming along?</h2>
        <p className="text-gray-400 mb-6">This shapes the vibe of your recommendations.</p>
        
        <div className="flex flex-wrap gap-5 md:gap-6">
          {whoOptions.map((option) => {
            const isActive = whoIsTraveling === option.id;
            return (
              <button
                key={option.id}
                onClick={() => setWhoIsTraveling(option.id)}
                className={`flex flex-col items-start py-3 px-5 pr-6 rounded-xl border transition-all duration-200 text-left ${
                  isActive
                    ? "border-[#F7EA00] bg-[#1a1a10] shadow-[0_0_15px_rgba(247,234,0,0.1)]"
                    : "border-gray-800 bg-transparent hover:border-gray-600"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className={`transition-colors ${isActive ? "text-[#F7EA00]" : "text-gray-400"}`}>
                    {option.icon}
                  </div>
                  <span className={`text-lg font-bold ${isActive ? "text-[#F7EA00]" : "text-white"}`}>
                    {option.label}
                  </span>
                </div>
                <span className={`text-sm ${isActive ? "text-[#F7EA00]/80" : "text-gray-500"}`}>
                  {option.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-800">
        <button 
          className="text-gray-500 hover:text-white transition-colors px-6 py-3 rounded-lg border border-transparent"
          disabled
        >
          &larr; Back
        </button>
        <button
          onClick={nextStep}
          disabled={interests.length === 0 || !whoIsTraveling}
          className="bg-[#DFD616] hover:bg-[#EAE121] text-[#0a0a0a] font-bold text-sm px-8 py-3 rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(223,214,22,0.15)] hover:shadow-[0_0_20px_rgba(223,214,22,0.3)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
