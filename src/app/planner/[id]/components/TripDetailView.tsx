"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Loader2,
  Map,
  RefreshCw,
  Trash2,
  Users,
} from "lucide-react";
import { tripService } from "@/services/trip.service";
import type { Trip, TripStatus } from "@/types/trip";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import NavbarHome from "@/app/(home)/NavbarHome";
import { MockDataBanner } from "./MockDataBanner";
import { InteractiveRoadmap } from "./InteractiveRoadmap";
import { ExpensesSection } from "./ExpensesSection";

type Tab = "itinerary" | "expenses";

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
      return "text-[#888] bg-[#1a1a1a] border-[#2a2a2a]";
  }
}

export function TripDetailView({ tripId }: TripDetailViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("itinerary");
  const [isLoading, setIsLoading] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  const isMock =
    searchParams.get("mock") === "1" ||
    tripService.isMockTrip(tripId);

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
    if (isMock) {
      toast.info("Regenerate is not available for demo data");
      return;
    }

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
    { id: "itinerary", label: "Roadmap" },
    { id: "expenses", label: "Expenses" },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#090909] text-white">
        <NavbarHome />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <Link
            href="/profile?tab=trips"
            className="inline-flex items-center gap-1.5 text-sm text-[#666] hover:text-white transition-colors mb-6"
          >
            <ArrowLeft size={16} />
            Back to trips
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
                className="inline-block mt-4 text-sm text-[#F7EA00] hover:underline"
              >
                Create a new trip
              </Link>
            </div>
          ) : (
            <>
              <MockDataBanner show={isMock} />

              <div className="mt-4 rounded-2xl border border-[#1a1a1a] bg-[#0d0d0d] overflow-hidden">
                <div className="p-5 sm:p-6 border-b border-[#1a1a1a]">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#161616] flex items-center justify-center shrink-0">
                        <Map size={18} className="text-[#F7EA00]" />
                      </div>
                      <div>
                        <h1 className="text-xl sm:text-2xl font-clash font-bold text-white">
                          {trip.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-[#666]">
                          <span className="inline-flex items-center gap-1">
                            <Calendar size={12} />
                            {formatDateRange(trip.start_date, trip.end_date)}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Users size={12} />
                            {trip.travelers_count} traveler{trip.travelers_count !== 1 ? "s" : ""}
                          </span>
                          <span
                            className={`inline-block px-2 py-0.5 rounded border text-[11px] capitalize ${statusStyle(trip.status)}`}
                          >
                            {trip.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 shrink-0">
                      {trip.status === "draft" && (
                        <button
                          type="button"
                          onClick={handleConfirm}
                          disabled={isUpdatingStatus}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#0a0a0a] bg-[#DFD616] hover:bg-[#EAE121] rounded-lg transition-colors disabled:opacity-50"
                        >
                          {isUpdatingStatus ? (
                            <Loader2 size={13} className="animate-spin" />
                          ) : (
                            <CheckCircle2 size={13} />
                          )}
                          Confirm trip
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={handleRegenerate}
                        disabled={isRegenerating || isMock}
                        title={isMock ? "Not available for demo data" : undefined}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-white bg-[#1a1a1a] hover:bg-[#222] rounded-lg transition-colors disabled:opacity-40"
                      >
                        {isRegenerating ? (
                          <Loader2 size={13} className="animate-spin" />
                        ) : (
                          <RefreshCw size={13} />
                        )}
                        Regenerate
                      </button>
                      <button
                        type="button"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-400 border border-red-500/20 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {isDeleting ? (
                          <Loader2 size={13} className="animate-spin" />
                        ) : (
                          <Trash2 size={13} />
                        )}
                        Delete
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex border-b border-[#1a1a1a] px-5 sm:px-6">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px ${
                        activeTab === tab.id
                          ? "border-[#F7EA00] text-[#F7EA00]"
                          : "border-transparent text-[#666] hover:text-white"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="p-5 sm:p-6">
                  {activeTab === "itinerary" && (
                    <InteractiveRoadmap
                      destinations={trip.destinations ?? []}
                      seed={trip.id}
                    />
                  )}
                  {activeTab === "expenses" && (
                    <ExpensesSection tripId={tripId} />
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
