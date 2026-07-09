import React from "react";
import Image from "next/image";
import Link from "next/link";
import { PUBLIC_ASSETS } from "@/lib/public-assets";

export default function Footer() {
  return (
    <footer className="w-full bg-footer pt-12 pb-6 px-6 lg:px-16 flex flex-col items-center">
      <div className="max-w-[1200px] w-full flex flex-col md:flex-row justify-between gap-10 md:gap-6 mb-10">
        
        {/* Column 1 - Logo */}
        <div className="flex flex-col max-w-[250px]">
          <Image
            src={PUBLIC_ASSETS.icons.fullLogo}
            alt="Waynx Logo"
            width={160}
            height={50}
            className="object-contain"
          />
        </div>

        {/* Column 2 - Company */}
        <div className="flex flex-col gap-3 pt-2 md:pt-4">
          <h4 className="text-accent font-bold text-lg mb-1">Company</h4>
          <Link href="/about" className="text-muted hover:text-foreground transition-colors outline-none focus:outline-none">About Us</Link>
          <Link href="/about#how-it-works" className="text-muted hover:text-foreground transition-colors outline-none focus:outline-none">How it works</Link>
          <Link href="/ask-waynx" className="text-muted hover:text-foreground transition-colors outline-none focus:outline-none">Ask Waynx</Link>
        </div>

        {/* Middle Column - Explore */}
        <div className="flex flex-col gap-3 pt-2 md:pt-4">
          <h4 className="text-accent font-bold text-lg mb-1">Explore</h4>
          <Link href="/places" className="text-muted hover:text-foreground transition-colors outline-none focus:outline-none">Places</Link>
          <Link href="/places?category=history" className="text-muted hover:text-foreground transition-colors outline-none focus:outline-none">History & Heritage</Link>
          <Link href="/places?category=beaches" className="text-muted hover:text-foreground transition-colors outline-none focus:outline-none">Beaches & Nature</Link>
          <Link href="/places?category=wellness" className="text-muted hover:text-foreground transition-colors outline-none focus:outline-none">Wellness & Healing</Link>
          <Link href="/places?category=culture" className="text-muted hover:text-foreground transition-colors outline-none focus:outline-none">Culture & Local Life</Link>
        </div>

        {/* Right Column - Legal */}
        <div className="flex flex-col gap-3 pt-2 md:pt-4">
          <h4 className="text-accent font-bold text-lg mb-1">Legal</h4>
          <Link href="/privacy" className="text-muted hover:text-foreground transition-colors outline-none focus:outline-none">Privacy policy</Link>
          <Link href="/terms" className="text-muted hover:text-foreground transition-colors outline-none focus:outline-none">Terms of service</Link>
          <Link href="/contact" className="text-muted hover:text-foreground transition-colors outline-none focus:outline-none">Contact</Link>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="max-w-[1200px] w-full pt-8 border-t border-border flex justify-center md:justify-start">
        <p className="text-muted text-sm">
          © 2026 WAYNX — Your journey, your way.
        </p>
      </div>
    </footer>
  );
}
