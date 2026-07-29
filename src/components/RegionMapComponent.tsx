"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Create modern HTML markers
const createModernIcon = (isActive: boolean) => {
  const html = isActive
    ? `<div class="relative flex items-center justify-center w-8 h-8">
         <div class="absolute inset-0 bg-[#F7EA00] rounded-full animate-ping opacity-60"></div>
         <div class="relative w-5 h-5 bg-[#F7EA00] rounded-full border-2 border-[#0a0a0a] shadow-lg shadow-black/50 z-10 flex items-center justify-center">
            <div class="w-1.5 h-1.5 bg-[#0a0a0a] rounded-full"></div>
         </div>
       </div>`
    : `<div class="w-4 h-4 bg-white rounded-full border-2 border-[#888888] shadow-md transition-transform hover:scale-125 hover:border-[#F7EA00]"></div>`;

  return L.divIcon({
    html,
    className: 'bg-transparent border-none', // Removes default Leaflet styling
    iconSize: isActive ? [32, 32] : [16, 16],
    iconAnchor: isActive ? [16, 16] : [8, 8],
  });
};

interface MapRegion {
  id: string;
  name: string;
  cityFilter: string;
  tagline: string;
  description: string;
  highlights: string[];
  imageUrl: string;
}

const REGION_COORDS: Record<string, [number, number]> = {
  "cairo": [30.0444, 31.2357],
  "alexandria": [31.2001, 29.9187],
  "luxor": [25.6872, 32.6396],
  "aswan": [24.0889, 32.8998],
  "hurghada": [27.2579, 33.8116],
  "sharm": [27.9158, 34.3299],
  "siwa": [29.2032, 25.5195],
};

function MapUpdater({ activeRegionId }: { activeRegionId: string }) {
  const map = useMap();
  
  useEffect(() => {
    const coords = REGION_COORDS[activeRegionId];
    if (coords) {
      map.flyTo(coords, 7, { animate: true, duration: 1.5 });
    }
  }, [activeRegionId, map]);

  return null;
}

function LabelsLayer() {
  const map = useMap();
  const [showLabels, setShowLabels] = useState(() => map.getZoom() > 6);

  useMapEvents({
    zoomend: () => {
      setShowLabels(map.getZoom() > 6);
    }
  });

  return showLabels ? (
    <TileLayer
      url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png"
      zIndex={10}
    />
  ) : null;
}

interface RegionMapComponentProps {
  regions: MapRegion[];
  activeRegion: MapRegion;
  onRegionSelect: (region: MapRegion) => void;
}

export function RegionMapComponent({ regions, activeRegion, onRegionSelect }: RegionMapComponentProps) {
  return (
    <div className="w-full h-full relative z-0">
      <MapContainer 
        center={[26.8206, 30.8025]} 
        zoom={6} 
        attributionControl={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png"
        />
        <LabelsLayer />
        <MapUpdater activeRegionId={activeRegion.id} />
        
        {regions.map((region) => {
          const coords = REGION_COORDS[region.id];
          if (!coords) return null;
          
          const isActive = region.id === activeRegion.id;

          return (
            <Marker 
              key={region.id} 
              position={coords}
              icon={createModernIcon(isActive)}
              eventHandlers={{
                click: () => onRegionSelect(region),
              }}
            />
          );
        })}
      </MapContainer>
    </div>
  );
}
