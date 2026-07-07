"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Sparkles, X } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

export const NAVBAR_HEIGHT = 68;

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Planner", href: "/planner" },
  { name: "Places", href: "/places" },
  { name: "About", href: "/about" },
];

function isLinkActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default function NavbarHome() {
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isHome = pathname === "/";
  const showSolidBg = !isHome || scrolled;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const askActive = isLinkActive(pathname, "/ask-waynx");

  const navbar = (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[200] transition-[background-color,backdrop-filter] duration-300 ${
          showSolidBg
            ? "bg-[#050505]/70 backdrop-blur-xl"
            : "bg-linear-to-b from-black/75 via-black/35 to-transparent"
        }`}
      >
        <div className="mx-auto flex h-[68px] max-w-[1440px] items-center justify-between gap-6 px-6 lg:px-12">
          <Link
            href="/"
            className="shrink-0 outline-none focus:outline-none"
            aria-label="WAYNX home"
          >
            <Image
              src="/icons/full_Logo.svg"
              alt="WAYNX"
              width={180}
              height={60}
              className="object-cover sm:h-12"
              priority
            />
          </Link>

          <nav className="hidden items-center gap-10 lg:flex">
            {NAV_LINKS.map((link) => {
              const isActive = isLinkActive(pathname, link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative py-1 text-[15px] font-medium transition-colors ${
                    isActive ? "text-[#DFD616]" : "text-[#C8C8C8] hover:text-white"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.span
                      layoutId="navbar-indicator"
                      className="absolute -bottom-1 left-0 right-0 mx-auto h-[2px] w-full rounded-full bg-[#DFD616]"
                      transition={{ type: "spring", bounce: 0.15, duration: 0.45 }}
                    />
                  )}
                </Link>
              );
            })}

            <Link
              href="/ask-waynx"
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[15px] font-medium transition-colors ${
                askActive
                  ? "bg-[#DFD616]/12 text-[#DFD616]"
                  : "text-[#C8C8C8] hover:bg-white/5 hover:text-white"
              }`}
            >
              <Sparkles size={15} className="text-[#DFD616]" />
              Ask Waynx
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            {isLoading ? (
              <div className="h-10 w-10 animate-pulse rounded-full bg-white/5" />
            ) : isAuthenticated && user ? (
              <Link
                href="/profile"
                aria-label={`Profile: ${user.full_name}`}
                title={user.full_name}
                className={`relative h-10 w-10 overflow-hidden rounded-full transition-all duration-200 ${
                  pathname === "/profile"
                    ? "ring-2 ring-[#DFD616]/70 ring-offset-2 ring-offset-[#050505]"
                    : "ring-2 ring-white/10 hover:ring-[#DFD616]/45"
                }`}
              >
                {user.avatar_url ? (
                  <Image
                    src={user.avatar_url}
                    alt={user.full_name}
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-[#2B2908] to-[#141414] text-sm font-semibold text-[#DFD616]">
                    {getInitials(user.full_name) || "U"}
                  </div>
                )}
              </Link>
            ) : (
              <div className="hidden items-center gap-5 sm:flex">
                <Link
                  href="/login"
                  className="text-[15px] font-medium text-[#C8C8C8] transition-colors hover:text-white"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="rounded-xl bg-[#DFD616] px-6 py-2.5 text-[15px] font-bold text-[#0a0a0a] transition-colors hover:bg-[#EAE121]"
                >
                  Sign up
                </Link>
              </div>
            )}

            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              className="rounded-lg p-2 text-[#AAAAAA] transition-colors hover:bg-white/5 hover:text-white lg:hidden"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[190] bg-black/60 lg:hidden"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu overlay"
            />
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-x-0 top-[68px] z-[195] bg-[#050505]/96 px-6 py-5 backdrop-blur-xl lg:hidden"
            >
              <nav className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => {
                  const isActive = isLinkActive(pathname, link.href);
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`rounded-xl px-4 py-3 text-base font-medium transition-colors ${
                        isActive
                          ? "bg-[#DFD616]/10 text-[#DFD616]"
                          : "text-[#CCCCCC] hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}

                <Link
                  href="/ask-waynx"
                  className={`mt-1 flex items-center gap-2 rounded-xl px-4 py-3 text-base font-medium transition-colors ${
                    askActive
                      ? "bg-[#DFD616]/10 text-[#DFD616]"
                      : "text-[#CCCCCC] hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Sparkles size={16} className="text-[#DFD616]" />
                  Ask Waynx
                </Link>

                {!isLoading && !isAuthenticated && (
                  <div className="mt-4 flex flex-col gap-2 border-t border-white/8 pt-4">
                    <Link
                      href="/login"
                      className="rounded-xl px-4 py-3 text-center text-base font-medium text-[#CCCCCC] hover:bg-white/5 hover:text-white"
                    >
                      Log in
                    </Link>
                    <Link
                      href="/register"
                      className="rounded-xl bg-[#DFD616] px-4 py-3 text-center text-base font-bold text-[#0a0a0a] hover:bg-[#EAE121]"
                    >
                      Sign up
                    </Link>
                  </div>
                )}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );

  if (!mounted) return null;

  return createPortal(navbar, document.body);
}
