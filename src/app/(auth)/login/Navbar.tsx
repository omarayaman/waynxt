import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Navbar() {
  return (
    <div className="absolute top-0 w-full h-[110px] flex justify-between items-center px-6 lg:px-12 z-50">
      <div className="flex items-center -ml-2 lg:-ml-4">
        {/* Full Logo */}
        <div className="shrink-0">
          <Image
            src="/icons/full_Logo.svg"
            alt="Waynx Logo"
            width={180}
            height={60}
            className="object-contain"
          />
        </div>
      </div>
      <div className="flex items-center gap-4 text-sm z-20">
        <ThemeToggle />
        <span className="text-muted">Don&apos;t have an account ? </span>
        <Link
          href="/register"
          className="text-accent hover:text-accent-hover transition-colors font-medium"
        >
        sign up
        </Link>
      </div>
    </div>
  );
}
