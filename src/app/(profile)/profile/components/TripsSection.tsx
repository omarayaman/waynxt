"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { tripService } from "@/services/trip.service";
import type { Trip } from "@/types/trip";
import { Loader2, Map, Plus, Trash2, Calendar, ChevronRight } from "lucide-react";
import { Pagination } from "@/components/Pagination";
import { isAxiosError } from "axios";

const TRIPS_PER_PAGE = 8;

function formatDateRange(start: string, end: string): string {
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" };
  const startDate = new Date(start).toLocaleDateString("en-US", opts);
  const endDate = new Date(end).toLocaleDateString("en-US", opts);
  return `${startDate} – ${endDate}`;
}

function getDestinationsLabel(trip: Trip): string {
  if (!trip.destinations?.length) return "—";
  return trip.destinations.map((d) => d.city).join(", ");
}

function statusStyle(status: string): string {
  switch (status) {
    case "completed":
      return "text-green-400/80 bg-green-400/10";
    case "draft":
      return "text-muted bg-surface-elevated";
    default:
      return "text-blue-400/80 bg-blue-400/10";
  }
}

interface TripsSectionProps {
  totalCount?: number;
}

export function TripsSection({ totalCount }: TripsSectionProps) {
  const router = useRouter();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(totalCount ?? 0);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const fetchTrips = useCallback(async (currentPage: number) => {
    setIsLoading(true);
    setError("");
    try {
      const response = await tripService.listTrips({ page: currentPage, perPage: TRIPS_PER_PAGE });
      setTrips(response.data);
      setTotal(response.meta.total);
    } catch {
      setError("Could not load your trips.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrips(page);
  }, [page, fetchTrips]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    setError("");
    try {
      await tripService.deleteTrip(id);
      setTrips((prev) => prev.filter((t) => t.id !== id));
      setTotal((prev) => Math.max(0, prev - 1));
      if (trips.length === 1 && page > 1) {
        setPage(page - 1);
      } else if (trips.length === 1) {
        fetchTrips(page);
      }
    } catch (err) {
      if (isAxiosError(err)) {
        setError(err.response?.data?.error?.message ?? "Failed to delete trip.");
      } else {
        setError("Failed to delete trip.");
      }
    } finally {
      setDeletingId(null);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / TRIPS_PER_PAGE));

  return (
    <div>
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-base font-medium text-foreground">Generated trips</h2>
          <p className="text-sm text-muted mt-1">
            {total > 0
              ? `${total} AI-generated itinerar${total === 1 ? "y" : "ies"}`
              : "Trips created with the AI planner"}
          </p>
        </div>
        <Link
          href="/planner"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-accent text-accent-foreground hover:bg-accent-hover rounded-lg transition-colors"
        >
          <Plus size={13} />
          New trip
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg border border-red-500/20 bg-red-500/5 text-red-400 text-sm">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-24">
          <Loader2 size={24} className="animate-spin text-muted" />
        </div>
      ) : trips.length === 0 ? (
        <div className="rounded-xl border border-border bg-surface py-16 text-center">
          <Map size={24} className="text-muted mx-auto mb-3" />
          <p className="text-sm text-muted">No trips yet</p>
          <p className="text-xs text-muted mt-1 mb-5">
            Use the AI planner to generate a personalized itinerary.
          </p>
          <Link
            href="/planner"
            className="inline-flex px-4 py-2 text-sm bg-accent text-accent-foreground hover:bg-accent-hover rounded-lg transition-colors"
          >
            Create a trip
          </Link>
        </div>
      ) : (
        <>
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface">
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted">Trip</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted hidden md:table-cell">
                    Destinations
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted hidden sm:table-cell">
                    Dates
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-muted">Status</th>
                  <th className="w-10" />
                </tr>
              </thead>
              <tbody>
                {trips.map((trip) => {
                  const isDeleting = deletingId === trip.id;
                  return (
                    <tr
                      key={trip.id}
                      className="group border-b border-border last:border-0 hover:bg-surface-elevated/50 transition-colors cursor-pointer"
                      onClick={() => router.push(`/planner/${trip.id}`)}
                    >
                      <td className="px-4 py-3.5">
                        <Link
                          href={`/planner/${trip.id}`}
                          className="flex items-center gap-3"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="w-8 h-8 rounded-lg bg-surface-elevated flex items-center justify-center shrink-0">
                            <Map size={14} className="text-muted" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-foreground font-medium truncate group-hover:text-accent transition-colors">
                              {trip.title}
                            </p>
                            <p className="text-xs text-muted mt-0.5 md:hidden">
                              {getDestinationsLabel(trip)}
                            </p>
                          </div>
                        </Link>
                      </td>
                      <td className="px-4 py-3.5 text-muted hidden md:table-cell truncate max-w-[180px]">
                        {getDestinationsLabel(trip)}
                      </td>
                      <td className="px-4 py-3.5 text-muted text-xs hidden sm:table-cell whitespace-nowrap">
                        <span className="inline-flex items-center gap-1">
                          <Calendar size={12} />
                          {formatDateRange(trip.start_date, trip.end_date)}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] capitalize ${statusStyle(trip.status)}`}
                        >
                          {trip.status}
                        </span>
                      </td>
                      <td className="px-2 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/planner/${trip.id}`}
                            className="p-2 rounded-lg text-muted hover:text-accent hover:bg-accent/10 opacity-0 group-hover:opacity-100 transition-all"
                            aria-label="View trip"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ChevronRight size={14} />
                          </Link>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(trip.id);
                            }}
                            disabled={isDeleting}
                            className="p-2 rounded-lg text-muted hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all disabled:opacity-50"
                            aria-label="Delete trip"
                          >
                            {isDeleting ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <Trash2 size={14} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            disabled={isLoading}
          />
        </>
      )}
    </div>
  );
}
