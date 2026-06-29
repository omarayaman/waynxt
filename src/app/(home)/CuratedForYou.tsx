import React from "react";
import Image from "next/image";

const curatedPlaces = [
  {
    id: "karnak",
    title: "Temple of Karnak",
    image: "/images/karnak.png",
    match: "95% Match",
    aiReason: "Matches your love for ancient architecture",
  },
  {
    id: "siwa",
    title: "Siwa Oasis",
    image: "/images/siwa.png",
    match: "92% Match",
    aiReason: "Perfect for your desert adventure preference",
  },
  {
    id: "dahab",
    title: "Dahab Blue Hole",
    image: "/images/dahab.png",
    match: "88% Match",
    aiReason: "Based on your interest in diving spots",
  },
];

export default function CuratedForYou() {
  return (
    <section className="w-full bg-[#050505] py-20 px-4 flex flex-col items-center overflow-hidden">
      <div className="max-w-[1200px] w-full flex flex-col items-center">
        <h2 className="text-4xl md:text-[44px] font-bold text-white mb-4 text-center">
          Curated for You
        </h2>
        <p className="text-gray-400 text-base md:text-lg text-center mb-12 max-w-[600px]">
          AI-powered recommendations based on your interests and travel history.
        </p>

        {/* Horizontal scroll container on mobile, flex on desktop */}
        <div className="flex overflow-x-auto pb-8 -mx-4 px-4 w-full md:w-auto md:overflow-visible md:pb-0 md:px-0 md:mx-0 snap-x snap-mandatory gap-6 hide-scrollbar justify-start md:justify-center">
          {curatedPlaces.map((place) => (
            <div
              key={place.id}
              className="min-w-[280px] w-[320px] md:w-[350px] shrink-0 snap-center bg-[#151515] rounded-2xl overflow-hidden border border-white/5 shadow-lg group cursor-pointer hover:border-[#E3D010]/30 transition-colors"
            >
              {/* Image Section */}
              <div className="relative h-[200px] w-full overflow-hidden">
                <Image
                  src={place.image}
                  alt={place.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#151515] to-transparent"></div>

                {/* Match Tag */}
                <div className="absolute top-4 right-4 bg-[#E3D010] text-[#0a0a0a] text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                    <polyline points="16 7 22 7 22 13" />
                  </svg>
                  {place.match}
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6 pt-2 flex flex-col gap-3">
                <h3 className="text-white font-bold text-xl">{place.title}</h3>

                <div className="flex flex-col gap-1.5 mt-1">
                  <div className="flex items-center gap-1.5 text-[#E3D010]">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10 13L12 17L14 13L18 11L14 9L12 5L10 9L6 11L10 13Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-[13px] font-bold">Why AI chose this:</span>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed pl-6">
                    {place.aiReason}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
