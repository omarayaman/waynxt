"use client";

import React, {useEffect, useState} from "react";
import {createPortal} from "react-dom";
import Link from "next/link";
import Image from "next/image";
import {usePathname} from "next/navigation";
import {AnimatePresence, motion} from "framer-motion";
import {Menu, Sparkles, X} from "lucide-react";
import {useAuthStore} from "@/store/useAuthStore";
import {ThemeToggle} from "@/components/ThemeToggle";
import {resolveTheme, useThemeStore} from "@/store/useThemeStore";

export const NAVBAR_HEIGHT = 60;

const NAV_LINKS = [
  {name: "Home", href: "/"},
  {name: "Planner", href: "/planner"},
  {name: "Places", href: "/places"},
  {name: "About", href: "/about"},
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

export default function NavbarHome({className}: {className?: string}) {
  const pathname = usePathname();
  const {user, isAuthenticated, isLoading} = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const themeMode = useThemeStore((state) => state.theme);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    setIsDark(resolveTheme(themeMode) === "dark");
  }, [themeMode]);

  const isHome = pathname === "/";
  const showSolidBg = !isHome || scrolled;
  const useGreenNavbar = !isDark;
  const onHero = isDark && isHome && !showSolidBg;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, {passive: true});
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
  const navLinkInactive =
    useGreenNavbar || onHero
      ? "text-[var(--navbar-muted)] hover:text-[var(--navbar-foreground)]"
      : "text-muted hover:text-foreground";
  const navLinkActive =
    useGreenNavbar || onHero ? "text-[var(--navbar-foreground)]" : "text-accent";
  const navIndicator = useGreenNavbar ? "bg-[var(--navbar-foreground)]" : "bg-accent";

  const navbar = (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[200] transition-[background-color,backdrop-filter] duration-300 ${className ?? ""} ${
          useGreenNavbar || showSolidBg || !isHome
            ? "bg-[var(--navbar-solid)] backdrop-blur-xl"
            : "bg-transparent"
        }`}>
        <div className="mx-auto flex h-[60px] max-w-[1440px] items-center justify-between gap-6 px-6 lg:px-12">
          <Link
            href="/"
            className="shrink-0 outline-none focus:outline-none"
            aria-label="WAYNX home">
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
                    isActive ? navLinkActive : navLinkInactive
                  }`}>
                  {link.name}
                  {isActive && (
                    <motion.span
                      layoutId="navbar-indicator"
                      className={`absolute -bottom-1 left-0 right-0 mx-auto h-[2px] w-full rounded-full ${navIndicator}`}
                      transition={{type: "spring", bounce: 0.15, duration: 0.45}}
                    />
                  )}
                </Link>
              );
            })}

            <Link
              href="/ask-waynx"
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[15px] font-medium transition-colors ${
                askActive
                  ? useGreenNavbar
                    ? "bg-white/15 text-[var(--navbar-foreground)]"
                    : "bg-accent/12 text-accent"
                  : useGreenNavbar || onHero
                    ? "text-[var(--navbar-muted)] hover:bg-white/10 hover:text-[var(--navbar-foreground)]"
                    : "text-muted hover:bg-accent-subtle hover:text-foreground"
              }`}>
              <Sparkles
                size={15}
                className={
                  useGreenNavbar || onHero ? "text-[var(--navbar-foreground)]" : "text-accent"
                }
              />
              Ask Waynx
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle variant="navbar" />

            {isLoading ? (
              <div className="h-10 w-10 animate-pulse rounded-full bg-white/10" />
            ) : isAuthenticated && user ? (
              <Link
                href="/profile"
                aria-label={`Profile: ${user.full_name}`}
                title={user.full_name}
                className={`relative h-10 w-10 overflow-hidden rounded-full transition-all duration-200 ${
                  pathname === "/profile"
                    ? useGreenNavbar || onHero
                      ? "ring-2 ring-white/70 ring-offset-2 ring-offset-[var(--navbar-solid)]"
                      : "ring-2 ring-accent/70 ring-offset-2 ring-offset-background"
                    : useGreenNavbar || onHero
                      ? "ring-2 ring-white/25 hover:ring-white/50"
                      : "ring-2 ring-border hover:ring-accent/45"
                }`}>
                {user.avatar_url ? (
                  <Image
                    src={user.avatar_url}
                    alt={user.full_name}
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div
                    className={`flex h-full w-full items-center justify-center text-sm font-semibold ${
                      useGreenNavbar || onHero
                        ? "bg-white/15 text-[var(--navbar-foreground)]"
                        : "bg-linear-to-br from-accent-subtle to-surface-elevated text-accent"
                    }`}>
                    {getInitials(user.full_name) || "U"}
                  </div>
                )}
              </Link>
            ) : (
              <div className="hidden items-center gap-5 sm:flex">
                <Link
                  href="/login"
                  className={`text-[15px] font-medium transition-colors ${
                    useGreenNavbar || onHero
                      ? "text-[var(--navbar-muted)] hover:text-[var(--navbar-foreground)]"
                      : "text-muted hover:text-foreground"
                  }`}>
                  Log in
                </Link>
                <Link
                  href="/register"
                  className={`rounded-xl px-6 py-2.5 text-[15px] font-bold transition-colors ${
                    useGreenNavbar
                      ? "bg-white text-brand-green-strong hover:bg-white/90"
                      : "bg-accent text-accent-foreground hover:bg-accent-hover"
                  }`}>
                  Sign up
                </Link>
              </div>
            )}

            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              className={`rounded-lg p-2 transition-colors lg:hidden ${
                useGreenNavbar || onHero
                  ? "text-[var(--navbar-muted)] hover:bg-white/10 hover:text-[var(--navbar-foreground)]"
                  : "text-muted hover:bg-foreground/5 hover:text-foreground"
              }`}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}>
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
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              exit={{opacity: 0}}
              className="fixed inset-0 z-[190] bg-[var(--overlay)] lg:hidden"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu overlay"
            />
            <motion.div
              initial={{opacity: 0, y: -8}}
              animate={{opacity: 1, y: 0}}
              exit={{opacity: 0, y: -8}}
              transition={{duration: 0.2}}
              className="fixed inset-x-0 top-[68px] z-[195] bg-[var(--navbar-mobile)] px-6 py-5 backdrop-blur-xl lg:hidden">
              <nav className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => {
                  const isActive = isLinkActive(pathname, link.href);
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`rounded-xl px-4 py-3 text-base font-medium transition-colors ${
                        isActive
                          ? "bg-white/15 text-[var(--navbar-foreground)]"
                          : "text-[var(--navbar-muted)] hover:bg-white/10 hover:text-[var(--navbar-foreground)]"
                      }`}>
                      {link.name}
                    </Link>
                  );
                })}

                <Link
                  href="/ask-waynx"
                  className={`mt-1 flex items-center gap-2 rounded-xl px-4 py-3 text-base font-medium transition-colors ${
                    askActive
                      ? "bg-white/15 text-[var(--navbar-foreground)]"
                      : "text-[var(--navbar-muted)] hover:bg-white/10 hover:text-[var(--navbar-foreground)]"
                  }`}>
                  <Sparkles size={16} className="text-[var(--navbar-foreground)]" />
                  Ask Waynx
                </Link>

                {!isLoading && !isAuthenticated && (
                  <div className="mt-4 flex flex-col gap-2 border-t border-[var(--navbar-border)] pt-4">
                    <Link
                      href="/login"
                      className="rounded-xl px-4 py-3 text-center text-base font-medium text-[var(--navbar-muted)] hover:bg-white/10 hover:text-[var(--navbar-foreground)]">
                      Log in
                    </Link>
                    <Link
                      href="/register"
                      className="rounded-xl bg-white px-4 py-3 text-center text-base font-bold text-brand-green-strong hover:bg-white/90">
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
