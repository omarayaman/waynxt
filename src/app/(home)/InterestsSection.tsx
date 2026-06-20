import React from "react";
import Image from "next/image";
import Link from "next/link";

const interests = [
  {
    id: "history",
    title: "History & Heritage",
    image: "/images/history.png",
    link: "/places?category=history",
  },
  {
    id: "beaches",
    title: "Beaches & Nature",
    image: "/images/beaches.png",
    link: "/places?category=beaches",
  },
  {
    id: "wellness",
    title: "Wellness & Healing",
    image: "/images/wellness.png",
    link: "/places?category=wellness",
  },
  {
    id: "religious",
    title: "Religious & Local Life",
    image: "/images/religious.png",
    link: "/places?category=religious",
  },
];

export default function InterestsSection() {
  return (
    <section className="w-full bg-[#050505] py-20 px-4 flex flex-col items-center">
      <div className="max-w-[1200px] w-full flex flex-col items-center">
        <h2 className="text-4xl md:text-[44px] font-bold text-white mb-4 text-center">
          Explore by interest
        </h2>
        <p className="text-gray-400 text-base md:text-lg text-center mb-16">
          Discover Egypt through different travel experiences.
        </p>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {interests.map((interest) => (
            <Link
              key={interest.id}
              href={interest.link}
              className="group relative h-[380px] w-full rounded-2xl overflow-hidden cursor-pointer block"
            >
              {/* Background Image */}
              <Image
                src={interest.image}
                alt={interest.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Dark Gradient Overlay (always visible but darker on hover) */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition-opacity duration-300 group-hover:opacity-90"></div>

              {/* Content Container */}
              <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col items-center text-center translate-y-6 transition-transform duration-300 group-hover:translate-y-0">
                <h3 className="text-white font-bold text-xl mb-3">
                  {interest.title}
                </h3>
                
                {/* Yellow Line (appears on hover) */}
                <div className="w-full max-w-[180px] h-[2px] bg-[#E3D010] scale-x-0 origin-center transition-transform duration-300 group-hover:scale-x-100"></div>
                
                {/* Explore Text (fades in on hover) */}
                <span className="text-[#E3D010] font-medium text-sm mt-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center gap-1">
                  Explore
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="group-hover:translate-x-1 transition-transform"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
