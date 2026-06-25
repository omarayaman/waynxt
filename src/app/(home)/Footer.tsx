import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-[#18191B] pt-20 pb-8 px-6 lg:px-16 flex flex-col items-center">
      <div className="max-w-[1200px] w-full flex flex-col md:flex-row justify-between gap-12 md:gap-8 mb-16">
        
        {/* Left Column - Logo & Main Links */}
        <div className="flex flex-col gap-6 max-w-[250px]">
          <div className="mb-2">
            <Image
              src="/icons/full_Logo.svg"
              alt="Waynx Logo"
              width={160}
              height={50}
              className="object-contain"
            />
          </div>
          <Link href="/about" className="text-gray-300 hover:text-white transition-colors outline-none focus:outline-none">About Us</Link>
          <Link href="/about#how-it-works" className="text-gray-300 hover:text-white transition-colors outline-none focus:outline-none">How it works</Link>
          <Link href="/ask-waynx" className="text-gray-300 hover:text-white transition-colors outline-none focus:outline-none">Ask Waynx</Link>
        </div>

        {/* Middle Column - Explore */}
        <div className="flex flex-col gap-6">
          <h4 className="text-[#E3D010] font-bold text-xl mb-2">Explore</h4>
          <Link href="/places" className="text-gray-300 hover:text-white transition-colors outline-none focus:outline-none">Places</Link>
          <Link href="/places?category=history" className="text-gray-300 hover:text-white transition-colors outline-none focus:outline-none">History & Heritage</Link>
          <Link href="/places?category=beaches" className="text-gray-300 hover:text-white transition-colors outline-none focus:outline-none">Beaches & Nature</Link>
          <Link href="/places?category=wellness" className="text-gray-300 hover:text-white transition-colors outline-none focus:outline-none">Wellness & Healing</Link>
          <Link href="/places?category=culture" className="text-gray-300 hover:text-white transition-colors outline-none focus:outline-none">Culture & Local Life</Link>
        </div>

        {/* Right Column - Legal */}
        <div className="flex flex-col gap-6">
          <h4 className="text-[#E3D010] font-bold text-xl mb-2">Legal</h4>
          <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors outline-none focus:outline-none">Privacy policy</Link>
          <Link href="/terms" className="text-gray-300 hover:text-white transition-colors outline-none focus:outline-none">Terms of service</Link>
          <Link href="/contact" className="text-gray-300 hover:text-white transition-colors outline-none focus:outline-none">Contact</Link>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="max-w-[1200px] w-full pt-8 border-t border-gray-800 flex justify-center md:justify-start">
        <p className="text-gray-500 text-sm">
          © 2026 WAYNX — Your journey, your way.
        </p>
      </div>
    </footer>
  );
}
