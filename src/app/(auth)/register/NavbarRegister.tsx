import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/ThemeToggle";

interface NavbarRegisterProps {
  step?: number;
}

export default function NavbarRegister({ step }: NavbarRegisterProps) {
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

      {step && (
        <span className="absolute left-1/2 -translate-x-1/2 text-sm text-muted tracking-wide">
          Step {step} of 2
        </span>
      )}

      <div className="flex items-center gap-4 text-sm z-20">
        <ThemeToggle />
        <span className="text-muted">Already have an account? </span>
        <Link
          href="/login"
          className="text-accent hover:text-accent-hover transition-all duration-300 font-medium"
        >
          log in
        </Link>
      </div>
    </div>
  );
}
