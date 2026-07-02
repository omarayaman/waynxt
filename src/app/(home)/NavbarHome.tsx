"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

import { useAuthStore } from "@/store/useAuthStore";
import { User, LogOut } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function NavbarHome() {
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading, logout } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Places", href: "/places" },
    { name: "About", href: "/about" },
    { name: "Ask Waynx", href: "/ask-waynx" },
  ];

  return (
    <nav className="absolute top-0 w-full h-[110px] flex justify-between items-center px-6 lg:px-12 z-50 bg-gradient-to-b from-black via-black/70 to-transparent">
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

      {/* Right: Auth Buttons */}
      <div className="flex items-center gap-6">
        {isLoading ? (
          <div className="w-10 h-10 rounded-full bg-gray-800 animate-pulse" />
        ) : isAuthenticated && user ? (
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-10 h-10 rounded-full overflow-hidden border border-[#333333] hover:border-[#DFD616]/50 transition-colors focus:outline-none flex items-center justify-center shrink-0"
            >
              {user.avatar_url ? (
                <Image src={user.avatar_url} alt={user.full_name} width={40} height={40} className="object-cover w-full h-full" />
              ) : (
                <div className="w-full h-full bg-[#111111] flex items-center justify-center text-[#DFD616]">
                  <User size={18} strokeWidth={2} />
                </div>
              )}
            </button>
            
            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-[#1A1A1A] border border-[#333] rounded-xl shadow-lg overflow-hidden py-2 z-50">
                <div className="px-4 py-2 border-b border-[#333] mb-1">
                  <p className="text-sm font-semibold text-white truncate">{user.full_name}</p>
                </div>
                <Link 
                  href="/profile"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-[#333] hover:text-white transition-colors"
                >
                  <User size={16} className="mr-2" /> Profile
                </Link>
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center px-4 py-2 text-sm text-red-400 hover:bg-[#333] transition-colors"
                >
                  <LogOut size={16} className="mr-2" /> Log out
                </button>
              </div>
            )}
          </div>
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
