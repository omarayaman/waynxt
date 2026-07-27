"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, openAuthModal, isAuthModalOpen } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [hasPrompted, setHasPrompted] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !hasPrompted) {
      // Open the login modal and tell it to redirect back here after login
      openAuthModal('login', pathname);
      setHasPrompted(true);
    }
  }, [isLoading, isAuthenticated, hasPrompted, openAuthModal, pathname]);

  useEffect(() => {
    if (hasPrompted && !isAuthModalOpen && !isAuthenticated && !isLoading) {
      router.push("/");
    }
  }, [hasPrompted, isAuthModalOpen, isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-yellow-500">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
}
