import React from 'react';
import { placesService } from '@/services/places.service';
import { Place } from '@/types/places';
import { notFound } from 'next/navigation';
import { MapPin, DollarSign, Sun, Users, Clock, Sparkles } from 'lucide-react';
import AskAiCta from './AskAiCta';
import { SavePlaceButton } from '@/components/SavePlaceButton';
import NavbarHome from '../../NavbarHome';
import Link from 'next/link';


// Helper to format tags
const formatTag = (tag: string) => tag.trim();

export default async function PlaceDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const placeId = parseInt(id);
  
  if (isNaN(placeId)) {
    notFound();
  }

  // Fetch the current place
  let place: Place | undefined;
  let errorMsg = null;
  try {
    const res = await placesService.getPlaceById(placeId);
    place = res.data;
  } catch (error) {
    console.error("Failed to fetch place:", error);
    errorMsg = error instanceof Error ? error.message : String(error);
  }

  if (errorMsg) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white bg-black">
        <p className="text-red-500">Error: {errorMsg}</p>
      </div>
    );
  }

  if (!place) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white bg-black">
        <p className="text-red-500">Error: Place is null or undefined.</p>
      </div>
    );
  }

  // Fetch related places in the same category
  let topRatedPlaces: Place[] = [];
  try {
    const relatedRes = await placesService.getPlaces({ 
      category: place.category,
      per_page: 15 
    });
    
    // Filter out current, sort by rating desc, slice top 8
    topRatedPlaces = (relatedRes.data || [])
      .filter((p) => p.id !== place.id)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 8);
  } catch (error) {
    console.error("Failed to fetch related places:", error);
    // Graceful fallback, just show empty related places
  }

  const suitableFor = place.suitable_for ? place.suitable_for.split(',').map(formatTag).filter(Boolean) : [];
  const suitableAge = place.suitable_age ? place.suitable_age.split(',').map(formatTag).filter(Boolean) : [];

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex flex-col">
      <NavbarHome />

      <main className="flex-1 w-full pb-24 relative z-10 flex flex-col items-center">
        
        {/* 1. Hero Section */}
        <div className="w-full relative min-h-[400px] h-[50vh] md:h-[60vh] lg:h-[70vh] max-h-[800px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={place.thumbnail_url || "https://images.unsplash.com/photo-1539667468225-eebb663053e6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"} 
            alt={place.name}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent"></div>
          
          <div className="absolute bottom-10 left-6 md:left-12 max-w-4xl z-20">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-[#1A1A1A] text-[#DFD616] px-3 py-1 rounded-full text-xs font-medium border border-[#333333]">
                Verified
              </span>
              <span className="bg-[#1A1A1A] text-[#CCCCCC] px-3 py-1 rounded-full text-xs font-medium border border-[#333333] capitalize">
                {place.category}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">{place.name}</h1>
            <div className="mt-4">
              <SavePlaceButton placeId={place.id} className="w-10 h-10" iconSize={18} />
            </div>
          </div>
        </div>

        {/* Content Container */}
        <div className="w-full max-w-[1600px] px-4 md:px-8 lg:px-12 flex flex-col gap-12 mt-8">
          
          {/* 2. Quick Info Bar */}
          <div className="flex flex-wrap items-center gap-4 py-4 border-y border-[#1A1A1A]">
            <div className="flex items-center gap-2 text-[#CCCCCC] text-sm">
              <MapPin size={18} className="text-[#DFD616]" />
              <span>{place.city}</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-[#333333] hidden sm:block"></div>
            
            <div className="flex items-center gap-2 text-[#CCCCCC] text-sm">
              <DollarSign size={18} className="text-[#DFD616]" />
              <span className="capitalize">{place.budget_level} budget</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-[#333333] hidden sm:block"></div>

            <div className="flex items-center gap-2 text-[#CCCCCC] text-sm">
              <Sun size={18} className="text-[#DFD616]" />
              <span>Best in {place.best_season}</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-[#333333] hidden md:block"></div>

            <div className="flex items-center gap-2 text-[#CCCCCC] text-sm">
              <Users size={18} className="text-[#DFD616]" />
              <span className="capitalize">{place.crowd_level}</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-[#333333] hidden md:block"></div>

            <div className="flex items-center gap-2 text-[#CCCCCC] text-sm">
              <Clock size={18} className="text-[#DFD616]" />
              <span>{place.duration_needed} hours</span>
            </div>
          </div>

          {/* 3. Description Section */}
          <section>
            <h2 className="text-2xl font-medium text-white mb-4">Description</h2>
            <p className="text-[#A1A1AA] text-lg md:text-xl leading-relaxed max-w-5xl">
              {place.description}
            </p>
          </section>

          {/* 4. Suitable For / Suitable Age */}
          <section className="flex flex-col gap-6">
            {suitableFor.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-[#666666] tracking-widest uppercase mb-4">Suitable For</h3>
                <div className="flex flex-wrap gap-3">
                  {suitableFor.map((tag) => (
                    <span 
                      key={tag}
                      className="px-5 py-2 rounded-full bg-[#2A280D] text-[#DFD616] text-sm md:text-base font-medium capitalize"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {suitableAge.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-[#666666] tracking-widest uppercase mb-4">Suitable Age</h3>
                <div className="flex flex-wrap gap-3">
                  {suitableAge.map((tag) => (
                    <span 
                      key={tag}
                      className="px-5 py-2 rounded-full bg-transparent border border-[#333333] text-[#A1A1AA] text-sm md:text-base font-medium capitalize"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* 5. Top Rated Places */}
          {topRatedPlaces.length > 0 && (
            <section className="mt-8">
              <h2 className="text-2xl font-medium text-white mb-6 capitalize">
                Top rated {place.category} places
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {topRatedPlaces.map((relatedPlace) => (
                  <Link href={`/places/${relatedPlace.id}`} key={relatedPlace.id} className="block group">
                    <div className="relative w-full h-[300px] md:h-[350px] rounded-3xl overflow-hidden border border-[#222222] group-hover:border-[#DFD616]/50 transition-all duration-300">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={relatedPlace.thumbnail_url || "https://images.unsplash.com/photo-1539667468225-eebb663053e6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
                        alt={relatedPlace.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent"></div>
                      
                      <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
                        <div className="bg-[#DFD616] text-[#0a0a0a] px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold shadow-lg">
                          <Sparkles size={12} strokeWidth={2.5} />
                          {relatedPlace.rating > 0 ? `${relatedPlace.rating} Rating` : 'New'}
                        </div>
                        <SavePlaceButton placeId={relatedPlace.id} />
                      </div>

                      <div className="absolute bottom-5 left-4 right-4 z-10">
                        <div className="flex items-center gap-1.5 text-[#DFD616] mb-1.5">
                          <MapPin size={12} strokeWidth={2.5} />
                          <span className="text-[10px] font-bold tracking-widest uppercase">{relatedPlace.city}</span>
                        </div>
                        <h3 className="text-lg font-bold text-white font-clash">{relatedPlace.name}</h3>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* 6. Ask AI CTA */}
          <AskAiCta />

        </div>
      </main>
    </div>
  );
}
