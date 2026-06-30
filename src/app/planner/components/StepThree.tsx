import React from "react";
import { useTripStore } from "@/store/useTripStore";
import { Snowflake, Flower2, Sun, Leaf } from "lucide-react";

export default function StepThree() {
  const { season, setSeason, journeyLength, setJourneyLength, prevStep } = useTripStore();

  const seasonOptions = [
    { id: "Winter", label: "Winter", desc: "Dec-Feb", icon: <Snowflake size={20} strokeWidth={1.5} /> },
    { id: "Spring", label: "Spring", desc: "Mar-May", icon: <Flower2 size={20} strokeWidth={1.5} /> },
    { id: "Summer", label: "Summer", desc: "Jun-Aug", icon: <Sun size={20} strokeWidth={1.5} /> },
    { id: "Autumn", label: "Autumn", desc: "Sep-Nov", icon: <Leaf size={20} strokeWidth={1.5} /> },
  ];

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJourneyLength(Number(e.target.value));
  };

  return (
    <div className="flex flex-col gap-10 font-poppins text-white">
      {/* Season */}
      <div>
        <h2 className="text-3xl font-bold font-clash mb-2">When are you travelling?</h2>
        <p className="text-gray-400 mb-6">Season affects which places are at their best.</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {seasonOptions.map((option) => {
            const isActive = season === option.id;
            return (
              <button
                key={option.id}
                onClick={() => setSeason(option.id)}
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

      {/* Journey Length Slider */}
      <div>
        <h2 className="text-3xl font-bold font-clash mb-2">How many days?</h2>
        <p className="text-gray-400 mb-10">Slide to set your trip length.</p>
        
        <div className="flex flex-col items-center max-w-3xl mx-auto w-full px-4">
          <div className="text-5xl font-clash font-bold text-[#F7EA00] mb-2 flex items-baseline gap-2">
            {journeyLength} <span className="text-xl font-poppins font-normal text-gray-400">days</span>
          </div>
          
          <div className="relative w-full py-4 mt-4">
            <input
              type="range"
              min="1"
              max="14"
              value={journeyLength}
              onChange={handleSliderChange}
              className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer outline-none relative z-10"
              style={{
                background: `linear-gradient(to right, #F7EA00 0%, #F7EA00 ${
                  ((journeyLength - 1) / 13) * 100
                }%, #374151 ${((journeyLength - 1) / 13) * 100}%, #374151 100%)`,
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
                  background: #F7EA00;
                  cursor: pointer;
                  box-shadow: 0 0 10px rgba(247, 234, 0, 0.5);
                }
                input[type=range]::-moz-range-thumb {
                  width: 24px;
                  height: 24px;
                  border-radius: 50%;
                  background: #F7EA00;
                  cursor: pointer;
                  border: none;
                  box-shadow: 0 0 10px rgba(247, 234, 0, 0.5);
                }
              `
            }} />
          </div>

          <div className="w-full flex justify-between text-sm text-gray-500 mt-2 font-medium px-1">
            <span>2 days</span>
            <span>2 weeks</span>
          </div>
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
          disabled={!season}
          onClick={() => alert("Trip generated! Check Zustand store for data.")}
          className="bg-[#DFD616] hover:bg-[#EAE121] text-[#0a0a0a] font-bold text-sm px-8 py-3 rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(223,214,22,0.15)] hover:shadow-[0_0_20px_rgba(223,214,22,0.3)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
        >
          Build my plan
        </button>
      </div>
    </div>
  );
}
