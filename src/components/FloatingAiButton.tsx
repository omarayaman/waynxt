"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const HIDDEN_PATHS = ["/planner"];

export default function FloatingAiButton() {
  const pathname = usePathname();

  if (HIDDEN_PATHS.some((path) => pathname.startsWith(path))) {
    return null;
  }

  return (
    <Link
      href="/ask-waynx"
      className="fixed bottom-8 right-8 z-50 flex items-center gap-2 bg-[#D4F64D] hover:bg-[#C2E53A] text-black font-bold px-6 py-4 rounded-full shadow-[0_4px_20px_rgba(212,246,77,0.3)] hover:shadow-[0_4px_25px_rgba(212,246,77,0.5)] transition-all duration-300 hover:-translate-y-1 group"
    >
      <span className="text-[15px]">Ask WAYNX AI</span>
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        className="group-hover:rotate-90 transition-transform duration-500"
      >
        <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
        <path d="M20 3L20.8 5.2L23 6L20.8 6.8L20 9L19.2 6.8L17 6L19.2 5.2L20 3Z" />
      </svg>
    </Link>
  );
}
