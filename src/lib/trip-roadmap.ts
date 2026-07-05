import type { TripActivity, TripDestination } from '@/types/trip';
import type React from 'react';



export function getCityAccent(city: string): { from: string; to: string; glow: string; ring: string } {
  const key = city.toLowerCase();
  // Site palette: pharaonic gold + warm sand tones (no neon greens/blues)
  if (key.includes('cairo') || key.includes('giza')) {
    return { from: '#DFD616', to: '#B8960C', glow: 'rgba(223,214,22,0.38)', ring: '#F7EA00' };
  }
  if (key.includes('luxor') || key.includes('aswan')) {
    return { from: '#D4A853', to: '#A67B5B', glow: 'rgba(212,168,83,0.35)', ring: '#E8C872' };
  }
  if (key.includes('alex')) {
    return { from: '#C4A265', to: '#8B7355', glow: 'rgba(196,162,101,0.32)', ring: '#DFD616' };
  }
  if (key.includes('hurghada') || key.includes('sharm') || key.includes('dahab')) {
    return { from: '#E8C872', to: '#C9952A', glow: 'rgba(232,200,114,0.32)', ring: '#F7EA00' };
  }
  return { from: '#DFD616', to: '#C4A265', glow: 'rgba(223,214,22,0.3)', ring: '#F7EA00' };
}

/** Shared Egyptian tourism palette — matches site (#DFD616, #F7EA00, dark panels). */
export const EGYPT_ROADMAP_THEME = {
  gold: '#DFD616',
  goldBright: '#F7EA00',
  goldHover: '#EAE121',
  sand: '#C4A265',
  amber: '#D4A853',
  bronze: '#A67B5B',
  papyrus: '#E8DCC4',
  night: '#050505',
  panel: '#0a0a0a',
  card: '#111111',
  border: '#1a1a1a',
  borderGold: 'rgba(223,214,22,0.25)',
  muted: '#888888',
  trail: '#2a2418',
} as const;

import { Landmark, Umbrella, Utensils, Heart, Church, TreePine, Mountain, MapPin } from 'lucide-react';

export function getActivityIcon(type?: string): React.ElementType {
  const t = type?.toLowerCase() || '';
  if (t.includes('cultural') || t.includes('historic')) return Landmark;
  if (t.includes('religious')) return Church;
  if (t.includes('shopping') || t.includes('market')) return Utensils; // Shopping icon wasn't in list, use Utensils for food/markets or add ShoppingBag
  if (t.includes('food') || t.includes('dining')) return Utensils;
  if (t.includes('adventure') || t.includes('desert') || t.includes('safari')) return Mountain;
  if (t.includes('beach') || t.includes('sea') || t.includes('coast') || t.includes('hurghada') || t.includes('sharm')) return Umbrella;
  if (t.includes('nature') || t.includes('park')) return TreePine;
  if (t.includes('wellness') || t.includes('spa')) return Heart;
  
  // Fallbacks by city name
  if (t.includes('cairo')) return Landmark;
  if (t.includes('luxor') || t.includes('aswan')) return Landmark;
  if (t.includes('alexandria')) return Umbrella;

  return MapPin;
}

export function getActivityTypeLabel(type?: string): string {
  switch (type?.toLowerCase()) {
    case 'cultural':
    case 'historical':
      return 'Historical';
    case 'shopping':
      return 'Shopping';
    case 'food':
      return 'Food';
    case 'adventure':
      return 'Adventure';
    case 'beach':
      return 'Beach';
    case 'nature':
      return 'Nature';
    default:
      return 'Sightseeing';
  }
}

/* ------------------------------------------------------------------ */
/* Interactive circular-node roadmap (flattened stops + random path)   */
/* ------------------------------------------------------------------ */

export interface RoadmapStop {
  id: string;
  order: number;
  city: string;
  dayNumber: number;
  date: string;
  activity: TripActivity;
}

/** Flatten all destinations → a single ordered list of stops (one per activity). */
export function buildRoadmapStops(destinations: TripDestination[]): RoadmapStop[] {
  const sorted = [...destinations].sort((a, b) => a.order_in_trip - b.order_in_trip);
  const stops: RoadmapStop[] = [];
  let order = 0;

  for (const dest of sorted) {
    const days = [...(dest.trip_days ?? [])].sort((a, b) => a.day_number - b.day_number);
    for (const day of days) {
      const activities = [...(day.activities ?? [])].sort((a, b) => a.order_in_day - b.order_in_day);
      for (const activity of activities) {
        stops.push({
          id: activity.id,
          order: order++,
          city: dest.city,
          dayNumber: day.day_number,
          date: day.date,
          activity,
        });
      }
    }
  }

  return stops;
}

export interface RoadmapPoint {
  x: number;
  y: number;
}

/** Deterministic pseudo-random generator so the meandering path stays stable per seed. */
function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export interface RoadmapLayoutMetrics {
  nodeSize: number;
  labelWidth: number;
  labelBlock: number;
  height: number;
  marginX: number;
  marginY: number;
  waveAmplitude: number;
}

/** Scale node size, canvas height, and spacing from place count + container width. */
export function computeRoadmapMetrics(count: number, width: number): RoadmapLayoutMetrics {
  const marginX = Math.max(36, Math.min(64, width * 0.045));
  const usableW = Math.max(width - marginX * 2, 180);
  const slotW = count > 0 ? usableW / count : usableW;

  const nodeSize = clamp(
    Math.floor(slotW * 0.7),
    count > 8 ? 46 : count > 5 ? 56 : 72,
    count <= 3 ? 96 : count <= 5 ? 84 : 72
  );

  const labelWidth = clamp(Math.floor(slotW * 0.92), 64, 120);
  const labelBlock = nodeSize <= 56 ? 36 : 42;
  const waveAmplitude = clamp(nodeSize * 0.75, 28, nodeSize * 1.0);
  const height = Math.round(nodeSize * 2.4 + labelBlock * 2 + 56);
  const marginY = Math.round(nodeSize * 0.35 + labelBlock + 20);

  return { nodeSize, labelWidth, labelBlock, height, marginX, marginY, waveAmplitude };
}

/**
 * Fit-to-viewport S-curve — all stops visible without horizontal scroll.
 */
export function computeRoadmapLayout({
  count,
  width,
  seed,
}: {
  count: number;
  width: number;
  seed: string;
}): RoadmapLayoutMetrics & { points: RoadmapPoint[]; canvasWidth: number } {
  if (count === 0) {
    const m = computeRoadmapMetrics(0, width);
    return { ...m, points: [], canvasWidth: width };
  }

  const rand = mulberry32(hashString(seed));
  const metrics = computeRoadmapMetrics(count, width);
  const { height, marginX, marginY, waveAmplitude, labelBlock } = metrics;
  const canvasWidth = width;
  const centerY = height / 2;
  const usableW = canvasWidth - marginX * 2;
  const maxY = height - marginY - labelBlock;

  const points: RoadmapPoint[] = [];

  for (let i = 0; i < count; i++) {
    const t = count === 1 ? 0.5 : i / (count - 1);
    const x = marginX + t * usableW;

    const yJitter = (rand() - 0.5) * waveAmplitude * 1.15;
    const y = clamp(centerY + yJitter, marginY, maxY);

    points.push({ x, y });
  }

  return { ...metrics, points, canvasWidth: width };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Build a smooth curved SVG path (Catmull-Rom → cubic Bézier) through the points. */
export function buildCurvedPath(points: RoadmapPoint[]): string {
  if (points.length < 2) return '';

  const d: string[] = [`M ${points[0].x} ${points[0].y}`];

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d.push(`C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`);
  }

  return d.join(' ');
}

/** Build path string for stops [0 … upToIndex] inclusive. */
export function buildPartialPath(points: RoadmapPoint[], upToIndex: number): string {
  if (upToIndex < 1) return '';
  return buildCurvedPath(points.slice(0, upToIndex + 1));
}

