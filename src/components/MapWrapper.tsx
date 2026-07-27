"use client";

import dynamic from "next/dynamic";

export const InteractiveMap = dynamic(
  () => import("./InteractiveMap").then((mod) => mod.InteractiveMap),
  { 
    ssr: false, 
    loading: () => (
      <div className="w-full h-full bg-gray-100 dark:bg-[#111] animate-pulse rounded-2xl flex items-center justify-center text-gray-400">
        Loading Map...
      </div>
    )
  }
);
