import React from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AuthLogo } from "@/components/AuthLogo";

export default function Navbar() {
  return (
    <div className="absolute top-0 w-full h-[110px] flex justify-between items-center px-6 lg:px-12 z-50">
      <div className="flex items-center -ml-2 lg:-ml-4">
        <AuthLogo />
      </div>
      <div className="flex items-center gap-4 text-sm z-20">
        <ThemeToggle />
      </div>
    </div>
  );
}
