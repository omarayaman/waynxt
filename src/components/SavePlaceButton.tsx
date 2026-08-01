"use client";

import React, { useEffect } from "react";
import { Heart, Loader2 } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useSavedPlacesStore } from "@/store/useSavedPlacesStore";

interface SavePlaceButtonProps {
  placeId: number;
  className?: string;
  iconSize?: number;
}

export function SavePlaceButton({ placeId, className = "", iconSize = 14 }: SavePlaceButtonProps) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const isSaved = useSavedPlacesStore((s) => s.isSaved(placeId));
  const isToggling = useSavedPlacesStore((s) => s.isToggling(placeId));
  const hydrateSavedIds = useSavedPlacesStore((s) => s.hydrateSavedIds);
  const toggleSave = useSavedPlacesStore((s) => s.toggleSave);

  useEffect(() => {
    if (isAuthenticated) {
      hydrateSavedIds();
    }
  }, [isAuthenticated, hydrateSavedIds]);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    try {
      await toggleSave({ placeId });
    } catch {
      // Error already logged in store
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isToggling}
      aria-label={isSaved ? "Remove from saved places" : "Save place"}
      className={`w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center transition-colors disabled:opacity-60 ${
        isSaved
          ? "text-red-400 hover:bg-red-500/20"
          : "text-white hover:bg-black/60"
      } ${className}`}
    >
      {isToggling ? (
        <Loader2 size={iconSize} className="animate-spin" />
      ) : (
        <Heart size={iconSize} fill={isSaved ? "currentColor" : "none"} />
      )}
    </button>
  );
}
