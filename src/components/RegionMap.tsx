"use client";

import dynamic from "next/dynamic";

export const RegionMap = dynamic(
  () => import("./RegionMapComponent").then((mod) => mod.RegionMapComponent),
  { 
    ssr: false, 
    loading: () => (
      <div className="w-full h-full bg-gray-100 dark:bg-[#111] animate-pulse flex items-center justify-center text-gray-400">
        Loading Map...
      </div>
    )
  }
);
