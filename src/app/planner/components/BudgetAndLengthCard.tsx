import React from "react";
import { Wallet, CalendarDays } from "lucide-react";
import { useJourneyStore } from "@/store/useJourneyStore";

export default function BudgetAndLengthCard() {
  const { budget, setBudget, journeyLength, setJourneyLength } = useJourneyStore();

  const budgetOptions = [
    { id: "Budget", label: "Budget" },
    { id: "Mid-Range", label: "Mid-Range" },
    { id: "Luxury", label: "Luxury" },
  ];

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJourneyLength(Number(e.target.value));
  };

  return (
    <div className="bg-[#0A0A0A] rounded-2xl border border-gray-800 p-6 flex flex-col w-full h-full gap-8">
      {/* Budget Section */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2 mb-6">
          <Wallet className="text-[#DFD616]" size={20} />
          <h3 className="text-base font-bold text-[#DFD616]">
            What's your budget?
          </h3>
        </div>
        <div className="flex flex-wrap gap-3">
          {budgetOptions.map((option) => {
            const isActive = budget === option.id;
            return (
              <button
                key={option.id}
                onClick={() => setBudget(option.id)}
                className={`rounded-full border px-5 py-3 transition-all duration-200 text-base flex-1 ${
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

      {/* Divider */}
      <div className="w-full h-px bg-gray-800"></div>

      {/* Journey Length Section */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2 mb-6">
          <CalendarDays className="text-[#DFD616]" size={20} />
          <h3 className="text-base font-bold text-[#DFD616]">
            Journey Length
          </h3>
        </div>
        
        <div className="relative w-full py-3 mb-2">
          <input
            type="range"
            min="1"
            max="21"
            value={journeyLength}
            onChange={handleSliderChange}
            className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer outline-none relative z-10"
            style={{
              background: `linear-gradient(to right, #DFD616 0%, #DFD616 ${
                ((journeyLength - 1) / 20) * 100
              }%, #1f2937 ${((journeyLength - 1) / 20) * 100}%, #1f2937 100%)`,
            }}
          />
          
          <style dangerouslySetInnerHTML={{
            __html: `
              input[type=range]::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background: #DFD616;
                cursor: pointer;
              }
              input[type=range]::-moz-range-thumb {
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background: #DFD616;
                cursor: pointer;
                border: none;
              }
            `
          }} />
        </div>

        <div className="flex justify-between items-center text-sm font-medium text-gray-400">
          <span className="text-[#DFD616]">{journeyLength} Days</span>
          <span>Max 21 days</span>
        </div>
      </div>
    </div>
  );
}
