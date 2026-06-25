"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function NavbarHome() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Places", href: "/places" },
    { name: "About", href: "/about" },
    { name: "Ask Waynx", href: "/ask-waynx" },
  ];

  return (
    <nav className="absolute top-0 w-full h-[110px] flex justify-between items-center px-6 lg:px-12 z-50 border-b border-[#333333]">
      {/* Left: Logo */}
      <div className="flex items-center -ml-2 lg:-ml-4">
        <Link href="/" className="shrink-0 outline-none focus:outline-none">
          <Image
            src="/icons/full_Logo.svg"
            alt="Waynx Logo"
            width={180}
            height={60}
            className="object-contain"
          />
        </Link>
      </div>

      {/* Center: Links */}
      <div className="hidden lg:flex items-center space-x-12 h-full">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <div key={link.name} className="h-full flex items-center relative">
              <Link
                href={link.href}
                className={`${
                  isActive
                    ? "text-[#E3D010]"
                    : "text-gray-300 hover:text-white hover:text-yellow-400"
                } font-medium transition-colors`}
              >
                {link.name}
              </Link>
              {isActive && (
                <motion.div
                  layoutId="navbar-indicator"
                  className="absolute bottom-[-1px] left-[-10px] right-[-10px] h-[3px] bg-[#E3D010]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Right: Auth Buttons */}
      <div className="flex items-center gap-6">
        <Link
          href="/register"
          className="bg-[#DFD616] hover:bg-[#EAE121] text-[#0a0a0a] font-bold text-sm px-8 py-3 rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(223,214,22,0.15)] hover:shadow-[0_0_20px_rgba(223,214,22,0.3)]"
        >
          Sign up
        </Link>
        <Link
          href="/login"
          className="text-white font-medium hover:text-gray-300 transition-colors"
        >
          Log in
        </Link>
      </div>
    </nav>
  );
}
