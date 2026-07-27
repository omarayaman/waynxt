"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Place } from "@/types/places";
import Link from "next/link";
import { Star, MapPin } from "lucide-react";

// Create modern HTML markers for places
const createModernPlaceIcon = () => {
  const html = `<div class="relative flex items-center justify-center w-8 h-8 group transition-transform duration-300 hover:-translate-y-1 hover:scale-110 drop-shadow-md">
         <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#EA4335" stroke="none">
           <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
           <circle cx="12" cy="10" r="4.5" fill="#ffffff"/>
         </svg>
       </div>`;

  return L.divIcon({
    html,
    className: 'bg-transparent border-none',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

const EGYPT_CITIES_COORDS: Record<string, [number, number]> = {
  "Cairo": [30.0444, 31.2357],
  "Aswan": [24.0889, 32.8998],
  "Luxor": [25.6872, 32.6396],
  "Hurghada": [27.2579, 33.8116],
  "Alexandria": [31.2001, 29.9187],
  "Sharm El-Sheikh": [27.9158, 34.3299],
  "Dahab": [28.501, 34.5126],
  "Marsa Alam": [25.0676, 34.879],
  "Giza": [30.0131, 31.2089],
  "Fayoum": [29.3084, 30.8428],
  "Siwa": [29.2032, 25.5195],
  "Nuweiba": [29.0322, 34.6669],
  "Taba": [29.4925, 34.8966],
  "Port Said": [31.2653, 32.3019],
  "Ismailia": [30.5965, 32.2715],
  "Suez": [29.9668, 32.5498],
  "Al Arish": [31.1316, 33.7984],
  "Marsa Matrouh": [31.3525, 27.2373],
  "Ain Sokhna": [29.5888, 32.3333],
  "El Gouna": [27.3942, 33.6782],
  "Saint Catherine": [28.5623, 33.9571],
  "Safaga": [26.7495, 33.9365],
  "Al Quseir": [26.1039, 34.2796],
  "Soma Bay": [26.8483, 33.9904],
  "Makadi Bay": [26.9882, 33.9015],
  "Ras Sedr": [29.5933, 32.7107],
  "Minya": [28.1099, 30.7503],
  "Asyut": [27.181, 31.1837],
  "Sohag": [26.557, 31.6948],
  "Farafra": [27.0594, 27.9734],
  "South Sinai": [28.7909, 33.8640],
};

function MapUpdater({ places }: { places: Place[] }) {
  const map = useMap();
  
  useEffect(() => {
    if (!places.length) return;
    
    const bounds = L.latLngBounds([]);
    let hasValidCoords = false;
    
    places.forEach(p => {
      const coords = EGYPT_CITIES_COORDS[p.city];
      if (coords) {
        bounds.extend(coords);
        hasValidCoords = true;
      }
    });

    if (hasValidCoords) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
    }
  }, [places, map]);

  return null;
}

function LabelsLayer() {
  const [showLabels, setShowLabels] = useState(false);
  const map = useMapEvents({
    zoomend: () => {
      setShowLabels(map.getZoom() > 6);
    },
    load: () => {
      setShowLabels(map.getZoom() > 6);
    }
  });

  useEffect(() => {
    setShowLabels(map.getZoom() > 6);
  }, [map]);

  return showLabels ? (
    <TileLayer
      url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png"
      zIndex={10}
    />
  ) : null;
}

export function InteractiveMap({ places }: { places: Place[] }) {
  const placesWithCoords = places.filter(p => EGYPT_CITIES_COORDS[p.city]);
  
  // We want to group places by city slightly so markers don't overlap completely.
  // Actually, grouping into a single marker per city with a popup listing them might be cleaner,
  // but let's just jitter them slightly around the city center.

  return (
    <div className="w-full h-full relative z-0">
      <MapContainer 
        center={[26.8206, 30.8025]} // Center of Egypt
        zoom={6} 
        attributionControl={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png"
        />
        <LabelsLayer />
        <MapUpdater places={placesWithCoords} />
        
        {placesWithCoords.map((place, i) => {
          const baseCoords = EGYPT_CITIES_COORDS[place.city];
          // Stable pseudo-random jitter based on place ID so markers in the same city are scattered slightly
          const seed = place.id * 12345;
          const jitterX = (((seed ^ (seed >> 16)) * 0x85ebca6b) & 0x7fffffff) / 0x7fffffff;
          const jitterY = ((((seed + 1) ^ ((seed + 1) >> 16)) * 0x85ebca6b) & 0x7fffffff) / 0x7fffffff;
          const coords: [number, number] = [
            baseCoords[0] + (jitterX - 0.5) * 0.05,
            baseCoords[1] + (jitterY - 0.5) * 0.05,
          ];

          return (
            <Marker key={place.id + '-' + i} position={coords} icon={createModernPlaceIcon()}>
              <Popup className="custom-popup">
                <div className="flex flex-col gap-2 min-w-[200px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={place.thumbnail_url} className="w-full h-28 object-cover rounded-lg" alt={place.name} />
                  <h3 className="font-bold text-gray-900 text-sm">{place.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <MapPin size={12} /> {place.city}
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center gap-1 text-xs font-semibold text-[#c2ba12]">
                      <Star size={12} className="fill-[#F7EA00]" /> {place.rating}
                    </div>
                    <Link href={`/places/${place.id}`} className="text-xs bg-[#F7EA00] text-black px-3 py-1.5 rounded font-medium hover:bg-[#e6da00]">
                      View
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Global styles for leaflet popups */}
      <style dangerouslySetInnerHTML={{__html: `
        .leaflet-popup-content-wrapper {
          border-radius: 1rem;
          overflow: hidden;
          padding: 0;
        }
        .leaflet-popup-content {
          margin: 12px;
          line-height: 1.4;
        }
        .leaflet-container a.leaflet-popup-close-button {
          top: 8px;
          right: 8px;
          color: white;
          background: rgba(0,0,0,0.3);
          border-radius: 50%;
          width: 20px;
          height: 20px;
          line-height: 20px;
          text-align: center;
        }
        .leaflet-container a.leaflet-popup-close-button:hover {
          color: white;
          background: rgba(0,0,0,0.6);
        }
      `}} />
    </div>
  );
}
