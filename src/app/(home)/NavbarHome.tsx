"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

import { useAuthStore } from "@/store/useAuthStore";
import { User } from "lucide-react";

export default function NavbarHome() {
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading } = useAuthStore();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Places", href: "/places" },
    { name: "About", href: "/about" },
    { name: "Ask Waynx", href: "/ask-waynx" },
  ];

  return (
    <nav className="absolute top-0 w-full h-[110px] flex justify-between items-center px-6 lg:px-12 z-50 bg-gradient-to-b from-black via-black/70 to-transparent">
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

      <div className="hidden lg:flex items-center space-x-12 h-full">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <div key={link.name} className="relative flex items-center">
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
                  className="absolute -bottom-2 left-[-10px] right-[-10px] h-[3px] bg-[#E3D010]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-6">
        {isLoading ? (
          <div className="w-10 h-10 rounded-full bg-gray-800 animate-pulse" />
        ) : isAuthenticated && user ? (
          <Link
            href="/profile"
            aria-label="Go to profile"
            className={`group h-10 rounded-full overflow-hidden border transition-all duration-300 focus:outline-none flex items-center shrink-0 ${
              pathname === "/profile"
                ? "border-[#DFD616]/60 ring-2 ring-[#DFD616]/20 bg-[#111]"
                : "border-[#333333] hover:border-[#DFD616]/50 hover:bg-[#111]"
            }`}
          >
            <div className="h-full aspect-square shrink-0 relative flex items-center justify-center">
              {user.avatar_url ? (
                <Image
                  src={user.avatar_url}
                  alt={user.full_name}
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full bg-[#111111] flex items-center justify-center text-[#DFD616]">
                  <User size={18} strokeWidth={2} />
                </div>
              )}
            </div>
            <div className="grid grid-cols-[0fr] group-hover:grid-cols-[1fr] transition-[grid-template-columns] duration-300 ease-in-out">
              <div className="overflow-hidden flex items-center">
                <span className="text-sm font-medium text-white whitespace-nowrap pr-4 pl-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                  {user.full_name}
                </span>
              </div>
            </div>
          </Link>
        ) : (
          <>
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
          </>
        )}
      </div>
    </nav>
  );
}
