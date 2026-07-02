import Link from "next/link";
import { Clock, MapPin, Star } from "lucide-react";
import { SavePlaceButton } from "@/components/SavePlaceButton";
import type { Place } from "@/types/places";

interface PlaceCardProps {
  place: Place;
}

export function PlaceCard({ place }: PlaceCardProps) {
  return (
    <Link
      href={`/places/${place.id}`}
      className="group flex flex-col rounded-xl border border-[#1a1a1a] bg-[#0a0a0a] overflow-hidden hover:border-[#333] transition-colors"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[#111]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={
            place.thumbnail_url ||
            "https://images.unsplash.com/photo-1539667468225-eebb663053e6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
          }
          alt={place.name}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="absolute top-2.5 right-2.5 z-10">
          <SavePlaceButton placeId={place.id} className="w-8 h-8" iconSize={14} />
        </div>

        {place.rating > 0 && (
          <div className="absolute top-2.5 left-2.5 z-10 inline-flex items-center gap-1 px-2 py-1 rounded-md bg-black/60 backdrop-blur-sm text-[#DFD616] text-xs font-medium">
            <Star size={11} fill="currentColor" />
            {place.rating}
          </div>
        )}
      </div>

      <div className="p-3.5 flex flex-col gap-1.5">
        <div>
          <h3 className="text-[15px] font-medium text-white leading-snug line-clamp-1 group-hover:text-[#DFD616] transition-colors">
            {place.name}
          </h3>
          <div className="flex items-center gap-1 mt-1 text-[#777]">
            <MapPin size={12} />
            <span className="text-xs truncate">{place.city}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#666]">
          <span className="capitalize">{place.category}</span>
          <span>·</span>
          <span className="capitalize">{place.budget_level}</span>
          <span>·</span>
          <span className="inline-flex items-center gap-0.5">
            <Clock size={11} />
            {place.duration_needed}h
          </span>
        </div>
      </div>
    </Link>
  );
}
