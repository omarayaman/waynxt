"use client";

import React, { useCallback, useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import {
  ArrowLeft,
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
import { ExpensesSection } from "./ExpensesSection";
import { RoadmapTimeline } from "./RoadmapTimeline";
import { ActivityDetailCard } from "./ActivityDetailCard";
import { buildRoadmapStops } from "@/lib/trip-roadmap";

type Tab = "plan" | "expenses";

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
      return "text-green-400/80 bg-green-400/10 border-green-400/20";
    case "confirmed":
      return "text-blue-400/80 bg-blue-400/10 border-blue-400/20";
    default:
      return "text-[#DFD616] bg-[#111] border-[#DFD616]/30";
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
    { id: "expenses", label: "Expenses" },
  ];

  return (
    <ProtectedRoute>
      <div 
        className="min-h-screen text-white relative pb-20"
        style={{
          background: "radial-gradient(ellipse 900px 500px at 15% -10%, rgba(245,197,24,0.04), transparent 60%), radial-gradient(ellipse 700px 500px at 100% 0%, rgba(255,93,122,0.03), transparent 60%), #000"
        }}
      >
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 md:px-12 py-8 relative z-10">
          <Link
            href="/planner"
            className="inline-flex items-center gap-1.5 text-sm text-[#666] hover:text-white transition-colors mb-6"
          >
            <ArrowLeft size={16} />
            Back to planner
          </Link>

          {isLoading ? (
            <div className="flex justify-center py-32">
              <Loader2 size={28} className="animate-spin text-[#555]" />
            </div>
          ) : error || !trip ? (
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6 text-center">
              <p className="text-red-400">{error || "Trip not found"}</p>
              <Link
                href="/planner"
                className="inline-block mt-4 text-sm text-[#DFD616] hover:underline"
              >
                Create a new trip
              </Link>
            </div>
          ) : (
            <>
              {/* Trip Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 bg-linear-to-br from-[#111] to-black border border-[#1a1a1a] rounded-2xl p-5 mb-5">
                <div>
                  <h1 className="text-xl sm:text-2xl font-clash font-bold text-white mb-2">
                    {trip.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2.5 text-[12.5px] text-[#9A9585]">
                    <span className="inline-flex items-center gap-1.5"><Calendar size={13} /> {formatDateRange(trip.start_date, trip.end_date)}</span>
                    <span className="text-[#5F5C50]">&bull;</span>
                    <span className="inline-flex items-center gap-1.5"><Users size={13} /> {trip.travelers_count} traveler{trip.travelers_count !== 1 ? "s" : ""}</span>
                    <span className="text-[#5F5C50]">&bull;</span>
                    <span className={`px-2 py-0.5 rounded-full border text-[10.5px] capitalize ${statusStyle(trip.status)}`}>
                      {trip.status}
                    </span>
                    <span className="text-[#5F5C50]">&bull;</span>
                    <span className="font-medium text-[#DFD616]">{totalDays} <span className="text-[#9A9585] font-normal">Days</span></span>
                    <span className="text-[#5F5C50]">&bull;</span>
                    <span className="font-medium text-[#DFD616]">{totalDestinations} <span className="text-[#9A9585] font-normal">Destinations</span></span>
                    <span className="text-[#5F5C50]">&bull;</span>
                    <span className="font-medium text-[#DFD616]">{totalActivities} <span className="text-[#9A9585] font-normal">Activities</span></span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleRegenerate}
                    disabled={isRegenerating}
                    className="flex-1 sm:flex-none inline-flex justify-center items-center gap-1.5 px-3.5 py-2 text-[12.5px] font-semibold text-[#9A9585] bg-transparent hover:bg-[#ffffff05] border border-[#1a1a1a] rounded-xl transition-colors disabled:opacity-50"
                  >
                    {isRegenerating ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                    Regenerate
                  </button>
                  {trip.status === "draft" && (
                    <button
                      type="button"
                      onClick={handleConfirm}
                      disabled={isUpdatingStatus}
                      className="flex-1 sm:flex-none inline-flex justify-center items-center gap-1.5 px-3.5 py-2 text-[12.5px] font-semibold text-[#1a1608] bg-[#DFD616] hover:bg-[#EAE121] rounded-xl transition-colors disabled:opacity-50"
                    >
                      {isUpdatingStatus ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                      Confirm Trip
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex-1 sm:flex-none inline-flex justify-center items-center gap-1.5 px-3.5 py-2 text-[12.5px] font-semibold text-red-400 bg-transparent hover:bg-red-500/10 border border-[#1a1a1a] rounded-xl transition-colors disabled:opacity-50"
                  >
                    {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                    Delete
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-6 border-b border-[#1a1a1a] mb-5">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2.5 px-1 text-[13px] font-semibold transition-colors border-b-2 -mb-[1px] ${
                      activeTab === tab.id
                        ? "border-[#DFD616] text-[#DFD616]"
                        : "border-transparent text-[#5F5C50] hover:text-[#9A9585]"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {activeTab === "plan" && (
                <>
                  <RoadmapTimeline 
                    stops={stops}
                    activeStopId={activeStopId}
                    onSelectStop={handleSelectStop}
                  />

                  <ActivityDetailCard 
                    stop={activeStop}
                    totalActivities={totalActivities}
                    onPrev={handlePrevStop}
                    onNext={handleNextStop}
                    onClose={() => setActiveStopId(null)}
                  />
                </>
              )}

              {activeTab === "expenses" && (
                <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-5 sm:p-6">
                  <ExpensesSection tripId={tripId} />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
