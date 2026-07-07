import { useEffect, useState } from "react";
import { placesService } from "@/services/places.service";
import type { Place } from "@/types/places";

interface UsePopularPlacesParams {
  limit?: number;
}

export function usePopularPlaces({ limit = 6 }: UsePopularPlacesParams = {}) {
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlaces = async (): Promise<void> => {
      try {
        const response = await placesService.getPopularPlaces();
        const data = response.data ?? [];
        setPlaces(data.slice(0, limit));
      } catch {
        try {
          const fallback = await placesService.getPlaces({
            page: 1,
            per_page: limit,
            sort_by: "rating",
          });
          setPlaces(fallback.data ?? []);
        } catch {
          setError("Failed to load places");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaces();
  }, [limit]);

  return { places, isLoading, error };
}
