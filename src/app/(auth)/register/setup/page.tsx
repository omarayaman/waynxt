"use client";

import React, { useState } from "react";
import NavbarRegister from "../NavbarRegister";

export default function SetupPage() {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    "history",
    "family - friendly",
  ]);
  const [visitingTime, setVisitingTime] = useState<string>("Not sure yet");
  const [storyPreference, setStoryPreference] = useState<string>(
    "Short highlights"
  );

  const interests = [
    "history",
    "museums",
    "culture",
    "adventure",
    "family - friendly",
  ];
  const visitingTimes = [
    "Yes with in 1 month",
    "Yes with in 3 months",
    "Not sure yet",
    "Just exploring",
  ];
  const storyPreferences = ["Deep stories", "Short highlights", "Deep stories"];

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-white font-sans overflow-hidden">
      {/* Top Navigation */}
      <NavbarRegister step={2} />

      {/* Form Content */}
      <div className="relative z-10 flex items-center min-h-[calc(100vh-40px)]">
        <div className="w-full max-w-[600px] px-8 lg:px-10 ml-[10%] mt-20">
          <h1 className="text-[42px] font-bold text-[#E3D010] mb-3 tracking-tight">
            Quick setup
          </h1>
          <p className="text-gray-300 mb-10 text-[15px] leading-relaxed">
            Answer 3 quick questions to begin your journey
          </p>

          <form className="space-y-10" action="#">
            {/* Question 1 */}
            <div className="space-y-4">
              <label className="text-[13px] text-gray-300 block ml-1">
                what do you want to explore ?
              </label>
              <div className="flex flex-wrap gap-3">
                {interests.map((item) => {
                  const isSelected = selectedInterests.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleInterest(item)}
                      className={`px-8 py-2.5 rounded-full text-[14px] transition-all duration-300 ${
                        isSelected
                          ? "bg-[#DFD616] text-[#0a0a0a] font-medium"
                          : "bg-[#181818] text-gray-400 hover:bg-[#222]"
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Question 2 */}
            <div className="space-y-4">
              <label className="text-[13px] text-gray-300 block ml-1">
                Are you visiting Egypt soon ?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {visitingTimes.map((item) => {
                  const isSelected = visitingTime === item;
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setVisitingTime(item)}
                      className={`px-6 py-3 rounded-xl border text-[14px] text-center transition-all duration-300 ${
                        isSelected
                          ? "bg-[#DFD616] border-[#DFD616] text-[#0a0a0a] font-medium"
                          : "bg-transparent border-[#333] text-gray-400 hover:border-gray-500"
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Question 3 */}
            <div className="space-y-4">
              <label className="text-[13px] text-gray-300 block ml-1">
                Are you visiting Egypt soon ?
              </label>
              <div className="flex flex-wrap gap-3">
                {storyPreferences.map((item, index) => {
                  // Use index in key because "Deep stories" is repeated
                  const isSelected = storyPreference === item && (index === 1 || item !== "Short highlights" ? true : false); // rough matching, since there are duplicates
                  // Wait, "Deep stories" is duplicated in the mock. Let's just use the value, so both will highlight if selected.
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setStoryPreference(item)}
                      className={`px-8 py-2.5 rounded-xl border text-[14px] transition-all duration-300 ${
                        isSelected
                          ? "bg-[#DFD616] border-[#DFD616] text-[#0a0a0a] font-medium"
                          : "bg-transparent border-[#333] text-gray-400 hover:border-gray-500"
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Finish Button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-[#DFD616] hover:bg-[#EAE121] text-[#0a0a0a] font-bold text-[15px] py-4 rounded-xl mt-12! transition-all duration-300 shadow-[0_0_15px_rgba(223,214,22,0.15)] hover:shadow-[0_0_20px_rgba(223,214,22,0.3)]"
            >
              Finish sign up
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
