"use client";

import React, { useEffect, useState } from "react";
import { 
  Loader2, MapPin, Star, Sparkles, Landmark, Waves, 
  Diamond, Moon, Building2, Tent, TreePine, Utensils, 
  Activity, Sun, Clock 
} from "lucide-react";
import { placesService } from "@/services/places.service";
import Link from "next/link";
import { SavePlaceButton } from "@/components/SavePlaceButton";
import type { Place } from "@/types/places";
import type { Trip } from "@/types/trip";

interface TripTopPlacesProps {
  trip: Trip;
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  history: Landmark,
  adventure: Tent,
  beach: Sun,
  nature: TreePine,
  religious: Building2,
  food: Utensils,
  wellness: Activity,
  // fallbacks
  historical: Landmark,
  coastal: Waves,
  hidden_gems: Diamond,
  nightlife: Moon,
  museums: Building2,
};

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
        
        const payload = {
          cities,
          budget: trip.preferences?.budget,
          travel_companion: trip.preferences?.travel_companion,
          interests: trip.preferences?.interests,
          age_group: trip.preferences?.age_group,
          season: trip.preferences?.season,
          crowd_preference: trip.preferences?.crowd_preference,
        };
        
        const response = await placesService.recommendPlaces(payload);
        
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
        <Loader2 size={32} className="mb-4 animate-spin text-accent" />
        <p className="text-muted">Finding the best spots for your trip...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-red-600 dark:text-red-400">
        <p>{error}</p>
      </div>
    );
  }

  if (places.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface-elevated dark:bg-[#1a1a1a]">
          <MapPin className="h-8 w-8 text-muted" />
        </div>
        <p className="mb-1 font-medium text-foreground dark:text-white">No places found</p>
        <p className="max-w-sm text-sm text-muted">
          We couldn't find any AI recommendations for this trip at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="mb-1 text-xl font-bold text-foreground dark:text-white">Top Recommended Places</h2>
          <p className="text-sm text-muted">
            AI-powered suggestions perfectly suited for your trip destinations.
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {places.map((place, index) => (
          <Link href={place.id ? `/places/${place.id}` : '#'} key={place.id || `place-${index}`} className="group relative w-full h-[380px] block rounded-[2rem] overflow-hidden border border-border hover:border-accent/50 transition-all duration-300 cursor-pointer">
            {/* Background Image */}
            <img 
              src={place.thumbnail_url || (place as any).image_url || "https://images.unsplash.com/photo-1539667468225-eebb663053e6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
              alt={place.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1539667468225-eebb663053e6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
              }}
            />
            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent"></div>
            
            {/* Top Badges */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
              <div className="bg-accent text-accent-foreground px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold shadow-lg">
                <Sparkles size={12} strokeWidth={2.5} />
                {place.rating > 0 ? `${place.rating} Rating` : 'New'}
              </div>
              {place.id && <SavePlaceButton placeId={place.id} />}
            </div>

            {/* Bottom Content */}
            <div className="absolute bottom-5 left-4 right-4 z-10">
              <h3 className="text-xl font-bold text-white mb-2 font-clash">{place.name}</h3>
              
              <div className="flex flex-wrap items-center gap-2 text-[#888] text-xs font-medium">
                <span className="flex items-center gap-1.5 text-[#ccc]">
                  <MapPin size={12} className="text-accent" /> {place.city}
                </span>
                
                {place.category && <span>&middot;</span>}
                {place.category && (() => {
                  const CatIcon = CATEGORY_ICONS[place.category.toLowerCase()] || Sparkles;
                  return (
                    <span className="flex items-center gap-1.5 capitalize">
                      <CatIcon size={12} className="text-accent" /> {place.category}
                    </span>
                  );
                })()}
                
                {place.category && place.budget_level && <span>&middot;</span>}
                {place.budget_level && (
                  <span className="flex items-center gap-1.5 capitalize">
                    <Diamond size={12} className="text-accent" /> {place.budget_level}
                  </span>
                )}
                
                {(place.category || place.budget_level) && place.duration_needed > 0 && <span>&middot;</span>}
                {place.duration_needed > 0 && (
                  <span className="flex items-center gap-1.5">
                    <Clock size={12} className="text-accent" /> {place.duration_needed}h
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
