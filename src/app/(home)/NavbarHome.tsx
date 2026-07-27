"use client";

import React, {useEffect, useState} from "react";
import Link from "next/link";
import Image from "next/image";
import {usePathname} from "next/navigation";
import {AnimatePresence, motion} from "framer-motion";
import {Menu, Sparkles, X} from "lucide-react";
import {useAuthStore} from "@/store/useAuthStore";
import {ThemeToggle} from "@/components/ThemeToggle";
import {useIsDark} from "@/store/useThemeStore";
import { PUBLIC_ASSETS } from "@/lib/public-assets";

export const NAVBAR_HEIGHT = 65;

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

function isAuthRoute(pathname: string): boolean {
  return pathname.startsWith("/login") || pathname.startsWith("/register");
}

function shouldHideNavbar(pathname: string): boolean {
  return isAuthRoute(pathname) || pathname.startsWith("/ask-waynx");
}

function getRouteNavbarClassName(pathname: string): string {
  if (pathname === "/places" || pathname.startsWith("/places/")) {
    return "bg-[var(--navbar-solid)]/80 backdrop-blur-xl";
  }
  if (pathname === "/planner" || pathname.startsWith("/planner/")) {
    return "dark:bg-transparent dark:backdrop-blur-none";
  }
  return "";
}

export default function NavbarHome({className}: {className?: string}) {
  const pathname = usePathname();
  const {user, isAuthenticated, isLoading, openAuthModal} = useAuthStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isDark = useIsDark();

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

  const isHome = pathname === "/";
  const showSolidBg = !isHome || scrolled;
  const onHero = isDark && isHome && !showSolidBg;
  const navbarClassName = [getRouteNavbarClassName(pathname), className].filter(Boolean).join(" ");

  if (shouldHideNavbar(pathname)) {
    return null;
  }

  const askActive = isLinkActive(pathname, "/ask-waynx");
  const navLinkInactive =
    "text-[var(--navbar-muted)] hover:text-[var(--navbar-foreground)]";
  const navLinkActive = "text-[var(--navbar-foreground)]";
  const navIndicator = "bg-accent";

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[200] transition-[background-color,backdrop-filter] duration-300 ${navbarClassName} ${
          showSolidBg || !isHome
            ? "bg-[var(--navbar-solid)] backdrop-blur-xl"
            : "bg-transparent"
        }`}>
        <div className="mx-auto flex h-[65px] max-w-[1440px] items-center justify-between gap-6 px-6 lg:px-12">
          <Link
            href="/"
            className="shrink-0 outline-none focus:outline-none flex items-center gap-2 mt-1"
            aria-label="WAYNX home">
            <Image
              src={PUBLIC_ASSETS.icons.logoLight}
              alt="WAYNX"
              width={740}
              height={235}
              priority
              className="h-8 sm:h-10 w-auto object-contain dark:hidden"
            />
            <Image
              src={PUBLIC_ASSETS.icons.fullLogo}
              alt="WAYNX"
              width={740}
              height={235}
              className="hidden h-8 sm:h-10 w-auto object-contain dark:block"
            />
          </Link>

          <nav className="hidden items-center gap-10 lg:flex">
            {NAV_LINKS.map((link) => {
              const isActive = isLinkActive(pathname, link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative py-1 text-[18px] font-medium transition-colors ${
                    isActive ? navLinkActive : navLinkInactive
                  }`}>
                  {link.name}
                  {isActive && (
                    <motion.span
                      layoutId={`navbar-indicator-${link.href}`}
                      className={`absolute -bottom-1 left-0 right-0 mx-auto h-[2px] w-full rounded-full ${navIndicator}`}
                      transition={{type: "spring", bounce: 0.15, duration: 0.45}}
                    />
                  )}
                </Link>
              );
            })}

            <Link
              href="/ask-waynx"
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[18px] font-medium transition-colors ${
                askActive
                  ? "bg-accent/12 text-accent"
                  : "text-[var(--navbar-muted)] hover:bg-[var(--navbar-control-bg)] hover:text-[var(--navbar-foreground)]"
              }`}>
              <Sparkles
                size={18}
                className={askActive ? "text-accent" : "text-[var(--navbar-foreground)]"}
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
                    ? "ring-2 ring-accent/70 ring-offset-2 ring-offset-background"
                    : "ring-2 ring-[var(--navbar-border)] hover:ring-accent/45"
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
                    className={`flex h-full w-full items-center justify-center text-sm font-semibold bg-linear-to-br from-[var(--navbar-control-bg)] to-[var(--surface-elevated)] text-[var(--navbar-foreground)]`}>
                    {getInitials(user.full_name) || "U"}
                  </div>
                )}
              </Link>
            ) : (
              <div className="hidden items-center gap-5 sm:flex">
                <button
                  type="button"
                  onClick={() => openAuthModal('login', '/planner')}
                  className="text-[15px] font-medium transition-colors text-[var(--navbar-muted)] hover:text-[var(--navbar-foreground)]">
                  Log in
                </button>
                <button
                  type="button"
                  onClick={() => openAuthModal('register', '/planner')}
                  className="rounded-xl px-6 py-2.5 text-[15px] font-bold transition-colors bg-[var(--navbar-foreground)] text-[var(--background)] hover:opacity-90">
                  Sign up
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              className="rounded-lg p-2 transition-colors lg:hidden text-[var(--navbar-muted)] hover:bg-[var(--navbar-control-bg)] hover:text-[var(--navbar-foreground)]"
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
                          ? "bg-[var(--navbar-control-bg)] text-[var(--navbar-foreground)]"
                          : "text-[var(--navbar-muted)] hover:bg-[var(--navbar-control-bg)] hover:text-[var(--navbar-foreground)]"
                      }`}>
                      {link.name}
                    </Link>
                  );
                })}

                <Link
                  href="/ask-waynx"
                  className={`mt-1 flex items-center gap-2 rounded-xl px-4 py-3 text-base font-medium transition-colors ${
                    askActive
                      ? "bg-[var(--navbar-control-bg)] text-[var(--navbar-foreground)]"
                      : "text-[var(--navbar-muted)] hover:bg-[var(--navbar-control-bg)] hover:text-[var(--navbar-foreground)]"
                  }`}>
                  <Sparkles size={16} className="text-[var(--navbar-foreground)]" />
                  Ask Waynx
                </Link>

                {!isLoading && !isAuthenticated && (
                  <div className="mt-4 flex flex-col gap-2 border-t border-[var(--navbar-border)] pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setMobileOpen(false);
                        openAuthModal('login', '/planner');
                      }}
                      className="rounded-xl px-4 py-3 text-center text-base font-medium text-[var(--navbar-muted)] hover:bg-[var(--navbar-control-bg)] hover:text-[var(--navbar-foreground)]">
                      Log in
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMobileOpen(false);
                        openAuthModal('register', '/planner');
                      }}
                      className="rounded-xl bg-[var(--navbar-foreground)] px-4 py-3 text-center text-base font-bold text-[var(--background)] hover:opacity-90">
                      Sign up
                    </button>
                  </div>
                )}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
