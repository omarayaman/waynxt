"use client";

import React, { useCallback, useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import {
  Calendar,
  CheckCircle2,
  Loader2,
  RefreshCw,
  Trash2,
  Users,
} from "lucide-react";
import { tripService } from "@/services/trip.service";
import type { Trip, TripStatus } from "@/types/trip";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import NavbarHome, { NAVBAR_HEIGHT } from "@/app/(home)/NavbarHome";
import PlannerBackground from "@/app/planner/components/PlannerBackground";
import { TripTopPlaces } from "./TripTopPlaces";
import { RoadmapTimeline } from "./RoadmapTimeline";
import { ActivityDetailCard } from "./ActivityDetailCard";
import { buildRoadmapStops } from "@/lib/trip-roadmap";

type Tab = "plan" | "top-places";

interface TripDetailViewProps {
  tripId: string;
}

function formatDateRange(start: string, end: string): string {
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" };
  return `${new Date(start).toLocaleDateString("en-US", opts)} – ${new Date(end).toLocaleDateString("en-US", opts)}`;
}

function statusStyle(status: string): string {
  switch (status) {
    case "completed":
      return "text-green-700 bg-green-500/10 border-green-500/25 dark:text-green-400/80 dark:bg-green-400/10 dark:border-green-400/20";
    case "confirmed":
      return "text-blue-700 bg-blue-500/10 border-blue-500/25 dark:text-blue-400/80 dark:bg-blue-400/10 dark:border-blue-400/20";
    default:
      return "text-accent bg-accent/10 border-accent/30 dark:bg-black/40";
  }
}

export function TripDetailView({ tripId }: TripDetailViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("plan");
  const [isLoading, setIsLoading] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  
  const [activeStopId, setActiveStopId] = useState<string | null>(null);

  // Derive flat list of stops
  const stops = useMemo(() => {
    if (!trip?.destinations) return [];
    return buildRoadmapStops(trip.destinations);
  }, [trip?.destinations]);

  // Derived stats
  const totalDays = trip?.destinations?.reduce((acc, dest) => acc + (dest.days_allocated || 0), 0) || 0;
  const totalDestinations = trip?.destinations?.length || 0;
  const totalActivities = stops.length;

  const activeStopIndex = stops.findIndex(s => s.id === activeStopId);
  const activeStop = activeStopIndex !== -1 ? stops[activeStopIndex] : null;

  const handlePrevStop = useCallback(() => {
    if (activeStopIndex > 0) {
      const prev = stops[activeStopIndex - 1];
      setActiveStopId(prev.id);
    }
  }, [activeStopIndex, stops]);

  const handleNextStop = useCallback(() => {
    if (activeStopIndex < stops.length - 1) {
      const next = stops[activeStopIndex + 1];
      setActiveStopId(next.id);
    }
  }, [activeStopIndex, stops]);

  const handleSelectStop = useCallback((id: string) => {
    setActiveStopId(id);
  }, []);

  const fetchTrip = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await tripService.getTrip(tripId);
      setTrip(data);
    } catch {
      setError("Could not load trip details.");
    } finally {
      setIsLoading(false);
    }
  }, [tripId]);

  useEffect(() => {
    fetchTrip();
  }, [fetchTrip]);

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      const updated = await tripService.regenerateItinerary(tripId);
      setTrip((prev) => (prev ? { ...prev, ...updated } : updated));
      toast.success("Itinerary regenerated");
    } catch (err) {
      const message = isAxiosError(err)
        ? err.response?.data?.error?.message ?? "Failed to regenerate"
        : "Failed to regenerate";
      toast.error(message);
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleConfirm = async () => {
    setIsUpdatingStatus(true);
    try {
      const updated = await tripService.updateTrip(tripId, { status: "confirmed" as TripStatus });
      setTrip((prev) => (prev ? { ...prev, ...updated } : updated));
      toast.success("Trip confirmed!");
    } catch {
      toast.error("Failed to confirm trip");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this trip and all associated data?")) return;

    setIsDeleting(true);
    try {
      await tripService.deleteTrip(tripId);
      toast.success("Trip deleted");
      router.push("/profile?tab=trips");
    } catch {
      toast.error("Failed to delete trip");
      setIsDeleting(false);
    }
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: "plan", label: "Trip Plan" },
    { id: "top-places", label: "Top places" },
  ];

  return (
    <ProtectedRoute>
      <div className="flex h-dvh flex-col overflow-hidden bg-background text-foreground font-poppins dark:bg-black">
        <NavbarHome
          className="dark:bg-transparent dark:backdrop-blur-none"
          // backLink={{ href: "/planner", label: "Back to planner" }}
        />

        <div
          className="relative flex min-h-0 flex-1 flex-col overflow-hidden px-4 sm:px-6"
          style={{
            paddingTop: NAVBAR_HEIGHT + 20,
            paddingBottom: 24,
          }}
        >
          <PlannerBackground />

          <div className="relative z-10 mx-auto flex min-h-0 w-full max-w-[1600px] flex-1 flex-col overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center py-32">
              <Loader2 size={28} className="animate-spin text-muted" />
            </div>
          ) : error || !trip ? (
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6 text-center">
              <p className="text-red-600 dark:text-red-400">{error || "Trip not found"}</p>
              <Link
                href="/planner"
                className="mt-4 inline-block text-sm text-accent hover:underline"
              >
                Create a new trip
              </Link>
            </div>
          ) : (
            <>
              {/* Trip Header */}
              <div className="mb-3 flex shrink-0 flex-col justify-between gap-4 rounded-2xl border border-border bg-white/80 backdrop-blur-md p-4 shadow-[0_12px_48px_color-mix(in_srgb,var(--foreground)_8%,transparent)] sm:flex-row sm:items-start sm:p-5 dark:border-white/10 dark:bg-black/40 dark:backdrop-blur-md dark:shadow-[0_8px_60px_rgba(0,0,0,0.55)]">
                <div>
                  <h1 className="mb-2 font-clash text-xl font-bold text-foreground sm:text-2xl dark:text-white">
                    {trip.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2.5 text-[12.5px] text-muted">
                    <span className="inline-flex items-center gap-1.5"><Calendar size={13} /> {formatDateRange(trip.start_date, trip.end_date)}</span>
                    <span className="text-border">&bull;</span>
                    <span className="inline-flex items-center gap-1.5"><Users size={13} /> {trip.travelers_count} traveler{trip.travelers_count !== 1 ? "s" : ""}</span>
                    <span className="text-border">&bull;</span>
                    <span className={`rounded-full border px-2 py-0.5 text-[10.5px] capitalize ${statusStyle(trip.status)}`}>
                      {trip.status}
                    </span>
                    <span className="text-border">&bull;</span>
                    <span className="font-medium text-accent">{totalDays} <span className="font-normal text-muted">Days</span></span>
                    <span className="text-border">&bull;</span>
                    <span className="font-medium text-accent">{totalDestinations} <span className="font-normal text-muted">Destinations</span></span>
                    <span className="text-border">&bull;</span>
                    <span className="font-medium text-accent">{totalActivities} <span className="font-normal text-muted">Activities</span></span>
                  </div>
                </div>

                <div className="flex shrink-0 flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleRegenerate}
                    disabled={isRegenerating}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-border bg-transparent px-3.5 py-2 text-[12.5px] font-semibold text-muted transition-colors hover:bg-surface-elevated disabled:opacity-50 sm:flex-none dark:border-white/10 dark:hover:bg-white/5 dark:hover:text-white"
                  >
                    {isRegenerating ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                    Regenerate
                  </button>
                  {(trip.status === "draft" || trip.status === "planned") && (
                    <button
                      type="button"
                      onClick={handleConfirm}
                      disabled={isUpdatingStatus}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-accent px-3.5 py-2 text-[12.5px] font-semibold text-accent-foreground transition-colors hover:bg-accent-hover disabled:opacity-50 sm:flex-none"
                    >
                      {isUpdatingStatus ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                      Confirm Trip
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-border bg-transparent px-3.5 py-2 text-[12.5px] font-semibold text-red-600 transition-colors hover:bg-red-500/10 disabled:opacity-50 sm:flex-none dark:text-red-400"
                  >
                    {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                    Delete
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="mb-2 flex shrink-0 gap-6 border-b border-border">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`-mb-px border-b-2 px-1 py-2.5 text-[13px] font-semibold transition-colors ${
                      activeTab === tab.id
                        ? "border-accent text-accent"
                        : "border-transparent text-muted hover:text-foreground dark:hover:text-gray-300"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
                {activeTab === "plan" && (
                  <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden lg:flex-row lg:items-stretch">
                    <div className="flex min-h-[220px] min-w-0 flex-1 flex-col overflow-hidden">
                      <RoadmapTimeline
                        stops={stops}
                        activeStopId={activeStopId}
                        onSelectStop={handleSelectStop}
                      />
                    </div>

                    {activeStop && (
                      <ActivityDetailCard
                        stop={activeStop}
                        totalActivities={totalActivities}
                        onPrev={handlePrevStop}
                        onNext={handleNextStop}
                        onClose={() => setActiveStopId(null)}
                      />
                    )}
                  </div>
                )}

                {activeTab === "top-places" && (
                  <div className="flex-1 min-h-0 overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pr-2 pb-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <TripTopPlaces trip={trip} />
                  </div>
                )}
              </div>
            </>
          )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
