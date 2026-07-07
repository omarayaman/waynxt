"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { PanelLeft, User } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

interface AskWaynxNavbarProps {
  title: string;
  isDesktopSidebarOpen: boolean;
  onOpenMobileSidebar: () => void;
  onToggleDesktopSidebar: () => void;
}

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Places", href: "/places" },
  { name: "About", href: "/about" },
];

export default function AskWaynxNavbar({
  title,
  isDesktopSidebarOpen,
  onOpenMobileSidebar,
  onToggleDesktopSidebar,
}: AskWaynxNavbarProps) {
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading } = useAuthStore();

  return (
    <header className="relative z-50 flex h-14 shrink-0 items-center gap-3 border-b border-[#1A1A1A] bg-[#050505] px-4 lg:px-6">
      <div className="flex min-w-0 items-center gap-3 lg:gap-6">
        <Link
          href="/"
          className="shrink-0 outline-none focus:outline-none"
          aria-label="Back to home"
        >
          <Image
            src="/icons/waynxt.svg"
            alt="Waynx"
            width={130}
            height={34}
            className="h-7 w-auto object-contain lg:h-8"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-5 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  isActive
                    ? "text-[#E3D010]"
                    : "text-[#AAAAAA] hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={onOpenMobileSidebar}
          className="rounded-lg p-1.5 text-[#888888] transition-colors hover:bg-[#1A1A1A] hover:text-white lg:hidden"
          aria-label="Open chat history"
        >
          <PanelLeft size={18} />
        </button>
        <button
          onClick={onToggleDesktopSidebar}
          className="hidden rounded-lg p-1.5 text-[#888888] transition-colors hover:bg-[#1A1A1A] hover:text-white lg:block"
          aria-label="Toggle chat history"
          title={isDesktopSidebarOpen ? "Hide sidebar" : "Show sidebar"}
        >
          <PanelLeft size={18} />
        </button>
      </div>

      <div className="min-w-0 flex-1 px-2 text-center lg:px-4">
        <h1 className="truncate text-sm font-medium text-white">{title}</h1>
        <p className="hidden truncate text-[11px] text-[#666666] lg:block">
          Ask about places, trips, and travel in Egypt
        </p>
      </div>

      <div className="flex shrink-0 items-center">
        {isLoading ? (
          <div className="h-9 w-9 animate-pulse rounded-full bg-[#1A1A1A]" />
        ) : isAuthenticated && user ? (
          <Link
            href="/profile"
            aria-label="Go to profile"
            className="flex h-9 w-9 overflow-hidden rounded-full border border-[#333333] transition-colors hover:border-[#DFD616]/50"
          >
            {user.avatar_url ? (
              <Image
                src={user.avatar_url}
                alt={user.full_name}
                width={36}
                height={36}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[#111111] text-[#DFD616]">
                <User size={16} strokeWidth={2} />
              </div>
            )}
          </Link>
        ) : (
          <Link
            href="/login"
            className="rounded-lg bg-[#DFD616] px-3 py-1.5 text-xs font-semibold text-black transition-colors hover:bg-[#EAE121]"
          >
            Log in
          </Link>
        )}
      </div>
    </header>
  );
}
