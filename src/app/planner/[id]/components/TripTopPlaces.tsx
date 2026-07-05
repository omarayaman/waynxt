"use client";

import React, { useEffect, useState } from "react";
import { Loader2, MapPin, Star } from "lucide-react";
import { placesService } from "@/services/places.service";
import Link from "next/link";
import { SavePlaceButton } from "@/components/SavePlaceButton";
import type { Place } from "@/types/places";
import type { Trip } from "@/types/trip";

interface TripTopPlacesProps {
  trip: Trip;
}

export function TripTopPlaces({ trip }: TripTopPlacesProps) {
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopPlaces = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const cities = trip.destinations?.map(d => d.city) || [];
        
        // Fallback to normal getPlaces since /places/recommend returns 404
        const response = await placesService.getPlaces({ 
          city: cities,
          sort_by: "rating"
        });
        
        setPlaces(response.data || []);
      } catch (err: any) {
        setError(err.message || "Failed to load top places for this trip.");
        console.error("Error fetching top places:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (trip) {
      fetchTopPlaces();
    }
  }, [trip]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-[#DFD616] mb-4" />
        <p className="text-[#888]">Finding the best spots for your trip...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-xl flex items-center justify-center">
        <p>{error}</p>
      </div>
    );
  }

  if (places.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center mb-4">
          <MapPin className="w-8 h-8 text-[#555]" />
        </div>
        <p className="text-white font-medium mb-1">No places found</p>
        <p className="text-[#666] text-sm max-w-sm">
          We couldn't find any AI recommendations for this trip at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Top Recommended Places</h2>
          <p className="text-[#888] text-sm">
            AI-powered suggestions perfectly suited for your trip destinations.
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {places.map((place) => (
          <div key={place.id} className="bg-[#151515] rounded-2xl overflow-hidden border border-[#222] hover:border-[#333] transition-colors group relative flex flex-col">
            <div className="absolute top-3 right-3 z-10">
              <SavePlaceButton placeId={place.id} />
            </div>
            <Link href={`/places/${place.id}`} className="flex-1 flex flex-col">
              <div className="aspect-[4/3] bg-[#222] relative overflow-hidden">
                {place.thumbnail_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={place.thumbnail_url} alt={place.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <MapPin className="text-[#444]" size={32} />
                  </div>
                )}
                {place.rating > 0 && (
                  <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1">
                    <Star size={12} className="text-[#DFD616] fill-current" />
                    {place.rating.toFixed(1)}
                  </div>
                )}
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-white font-bold mb-1 truncate">{place.name}</h3>
                <div className="text-[#888] text-sm mb-3 flex items-center gap-1 truncate">
                  <MapPin size={14} />
                  {place.city}
                </div>
                <div className="mt-auto flex items-center justify-between text-xs">
                  <span className="text-[#555] bg-[#222] px-2 py-1 rounded-md">{place.category}</span>
                  <span className="text-[#DFD616]">{place.budget_level}</span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
