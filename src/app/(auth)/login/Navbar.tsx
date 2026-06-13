import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <div className="absolute top-0 w-full h-[110px] flex justify-between items-center px-6 lg:px-12 z-10">
      
      <div className="flex items-center">
        {/* Full Logo */}
        <div className="shrink-0">
          <Image
            src="/icons/full_Logo.svg"
            alt="Waynx Logo"
            width={200}
            height={70}
            className="object-contain"
          />
        </div>
      </div>
      <div className="text-sm z-20">
        <span className="text-gray-300">Don&apos;t have an account ? </span>
        <Link
          href="/register"
          className="text-[#E3D010] hover:text-yellow-300 transition-colors font-medium"
        >
          sign up
        </Link>
      </div>
    </div>
  );
}
