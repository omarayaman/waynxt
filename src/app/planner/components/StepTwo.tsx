import React from "react";
import { useTripStore } from "@/store/useTripStore";
import { Wallet, Banknote, Diamond, Backpack, User, Glasses, Sparkles, Scale, Moon } from "lucide-react";

export default function StepTwo() {
  const { 
    budget, setBudget, 
    ageGroup, setAgeGroup, 
    crowdPreference, setCrowdPreference, 
    nextStep, prevStep 
  } = useTripStore();

  const budgetOptions = [
    { id: "Budget", label: "Budget", desc: "Local & economical", icon: <Wallet size={20} strokeWidth={1.5} /> },
    { id: "Mid-range", label: "Mid-range", desc: "Comfort & value", icon: <Banknote size={20} strokeWidth={1.5} /> },
    { id: "Luxury", label: "Luxury", desc: "Premium experiences", icon: <Diamond size={20} strokeWidth={1.5} /> },
  ];

  const ageOptions = [
    { id: "Teen", label: "Teen", desc: "Under 20", icon: <Backpack size={20} strokeWidth={1.5} /> },
    { id: "Adult", label: "Adult", desc: "20-60 years", icon: <User size={20} strokeWidth={1.5} /> },
    { id: "Senior", label: "Senior", desc: "60+ years", icon: <Glasses size={20} strokeWidth={1.5} /> },
  ];

  const crowdOptions = [
    { id: "Lively", label: "Lively", desc: "Popular & vibrant", icon: <Sparkles size={20} strokeWidth={1.5} /> },
    { id: "No preference", label: "No preference", desc: "Anything goes", icon: <Scale size={20} strokeWidth={1.5} /> },
    { id: "Peaceful", label: "Peaceful", desc: "Quiet & secluded", icon: <Moon size={20} strokeWidth={1.5} /> },
  ];

  const canContinue = budget && ageGroup && crowdPreference;

  return (
    <div className="flex flex-col gap-10 font-poppins text-white">
      {/* Budget */}
      <div>
        <h2 className="text-3xl font-bold font-clash mb-2">What&apos;s your budget?</h2>
        <p className="text-gray-400 mb-6">Per-day spending comfort level.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {budgetOptions.map((option) => {
            const isActive = budget === option.id;
            return (
              <button
                key={option.id}
                onClick={() => setBudget(option.id)}
                className={`flex flex-col items-start p-5 rounded-xl border transition-all duration-200 text-left ${
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

      {/* Age Group */}
      <div>
        <h2 className="text-3xl font-bold font-clash mb-2">Age group?</h2>
        <p className="text-gray-400 mb-6">Helps calibrate activity intensity.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ageOptions.map((option) => {
            const isActive = ageGroup === option.id;
            return (
              <button
                key={option.id}
                onClick={() => setAgeGroup(option.id)}
                className={`flex flex-col items-start p-5 rounded-xl border transition-all duration-200 text-left ${
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

      {/* Crowd Preference */}
      <div>
        <h2 className="text-3xl font-bold font-clash mb-2">Crowd preference?</h2>
        <p className="text-gray-400 mb-6">Popular hotspots or hidden gems?</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {crowdOptions.map((option) => {
            const isActive = crowdPreference === option.id;
            return (
              <button
                key={option.id}
                onClick={() => setCrowdPreference(option.id)}
                className={`flex flex-col items-start p-5 rounded-xl border transition-all duration-200 text-left ${
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
          onClick={prevStep}
          className="text-gray-400 hover:text-white transition-colors px-6 py-3 rounded-lg border border-gray-800 hover:bg-[#1A1A1A]"
        >
          &larr; Back
        </button>
        <button
          onClick={nextStep}
          disabled={!canContinue}
          className="bg-[#DFD616] hover:bg-[#EAE121] text-[#0a0a0a] font-bold text-sm px-8 py-3 rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(223,214,22,0.15)] hover:shadow-[0_0_20px_rgba(223,214,22,0.3)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
