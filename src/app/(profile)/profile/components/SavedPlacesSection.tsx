"use client";

import React from "react";
import Link from "next/link";
import { MapPin, Loader2, ExternalLink, Heart, Trash2 } from "lucide-react";
import { Pagination } from "@/components/Pagination";
import type { SavedPlaceProfile } from "@/types/user";

interface SavedPlacesSectionProps {
  places: SavedPlaceProfile[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onUnsave?: ({ placeId }: { placeId: number }) => Promise<void>;
  unsavingIds?: Record<number, boolean>;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function SavedPlacesSection({
  places,
  isLoading,
  currentPage,
  totalPages,
  totalCount,
  onPageChange,
  onUnsave,
  unsavingIds = {},
}: SavedPlacesSectionProps) {
  return (
    <div>
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-base font-medium text-white">Saved places</h2>
          <p className="text-sm text-[#666] mt-1">
            {totalCount > 0
              ? `${totalCount} place${totalCount === 1 ? "" : "s"} saved`
              : "Places you've bookmarked for later"}
          </p>
        </div>
        <Link
          href="/places"
          className="text-xs text-[#777] hover:text-[#bbb] transition-colors flex items-center gap-1"
        >
          Browse places <ExternalLink size={12} />
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-24">
          <Loader2 size={24} className="animate-spin text-[#555]" />
        </div>
      ) : places.length === 0 ? (
        <div className="rounded-xl border border-border bg-[#0d0d0d] py-16 text-center">
          <Heart size={24} className="text-[#444] mx-auto mb-3" />
          <p className="text-sm text-[#888]">No saved places yet</p>
          <p className="text-xs text-[#555] mt-1 mb-5">Explore destinations and save your favorites.</p>
          <Link
            href="/places"
            className="inline-flex px-4 py-2 text-sm text-white bg-[#1a1a1a] hover:bg-[#222] rounded-lg transition-colors"
          >
            Explore places
          </Link>
        </div>
      ) : (
        <>
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-[#0d0d0d]">
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#666]">Place</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#666] hidden sm:table-cell">
                    Location
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-[#666]">Saved</th>
                  {onUnsave && (
                    <th className="text-right px-4 py-3 text-xs font-medium text-[#666] w-12" />
                  )}
                </tr>
              </thead>
              <tbody>
                {places.map((place) => (
                  <tr
                    key={place.id}
                    className="border-b border-border last:border-0 hover:bg-[#111] transition-colors"
                  >
                    <td className="px-4 py-3.5">
                      <Link
                        href={`/places/${place.place_id}`}
                        className="flex items-center gap-3 group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-[#161616] overflow-hidden flex items-center justify-center shrink-0">
                          {place.thumbnail_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={place.thumbnail_url}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <MapPin size={14} className="text-[#555]" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <span className="text-white font-medium truncate block group-hover:text-accent transition-colors">
                            {place.place_name}
                          </span>
                          {place.category && (
                            <span className="text-xs text-[#555] truncate block">{place.category}</span>
                          )}
                        </div>
                      </Link>
                    </td>
                    <td className="px-4 py-3.5 text-[#777] hidden sm:table-cell">{place.location}</td>
                    <td className="px-4 py-3.5 text-[#555] text-right text-xs tabular-nums">
                      {formatDate(place.saved_at)}
                    </td>
                    {onUnsave && (
                      <td className="px-4 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => onUnsave({ placeId: place.place_id })}
                          disabled={unsavingIds[place.place_id]}
                          aria-label={`Remove ${place.place_name} from saved`}
                          className="p-1.5 rounded-lg text-[#555] hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                        >
                          {unsavingIds[place.place_id] ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Trash2 size={14} />
                          )}
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            disabled={isLoading}
          />
        </>
      )}
    </div>
  );
}
