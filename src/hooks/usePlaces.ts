import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePlacesStore } from '@/store/usePlacesStore';
import { placesService } from '@/services/places.service';
import { Place, PaginationMeta } from '@/types/places';

export function usePlaces() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [places, setPlaces] = useState<Place[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const store = usePlacesStore();
  const abortControllerRef = useRef<AbortController | null>(null);
  const isFirstMount = useRef(true);

  // 1. Initialize store from URL on first mount
  useEffect(() => {
    store.setFiltersFromURL(new URLSearchParams(searchParams.toString()));
    isFirstMount.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2. Sync URL when store changes & Fetch data
  useEffect(() => {
    if (isFirstMount.current) return;

    const syncUrlAndFetch = async () => {
      const params = new URLSearchParams();
      
      if (store.currentPage > 1) params.append('page', store.currentPage.toString());
      if (store.perPage !== 150) params.append('per_page', store.perPage.toString());
      if (store.search) params.append('search', store.search);
      if (store.activeCategory && store.activeCategory !== 'all') params.append('category', store.activeCategory);
      if (store.activeSeason) params.append('best_season', store.activeSeason);
      if (store.activeCrowdLevel) params.append('crowd_level', store.activeCrowdLevel);
      if (store.activeSuitableFor) params.append('suitable_for', store.activeSuitableFor);
      if (store.activeAge) params.append('suitable_age', store.activeAge);
      if (store.sortBy && store.sortBy !== 'rating') params.append('sort_by', store.sortBy);
      
      store.activeCities.forEach(c => params.append('cities[]', c));
      store.activeBudgets.forEach(b => params.append('budget_level[]', b));

      // Update URL without full reload
      const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
      router.replace(newUrl, { scroll: false });

      // Fetch data with AbortController
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();
      
      if (store.currentPage === 1) {
        setIsLoading(true);
      } else {
        setIsFetchingMore(true);
      }
      setError(null);

      try {
        const response = await placesService.getPlaces({
          page: store.currentPage,
          per_page: store.perPage,
          search: store.search,
          category: store.activeCategory,
          city: store.activeCities,
          budget_level: store.activeBudgets,
          best_season: store.activeSeason,
          crowd_level: store.activeCrowdLevel,
          suitable_for: store.activeSuitableFor,
          suitable_age: store.activeAge,
          sort_by: store.sortBy
        }, abortControllerRef.current.signal);

        if (store.currentPage === 1) {
          setPlaces(response.data);
        } else {
          setPlaces(prev => {
            // Prevent duplicates if React StrictMode fires twice
            const existingIds = new Set(prev.map(p => p.id));
            const newPlaces = response.data.filter(p => !existingIds.has(p.id));
            return [...prev, ...newPlaces];
          });
        }

        if (response.meta) {
          setMeta(response.meta);
        }
      } catch (err: unknown) {
        const error = err as Error;
        if (error.name !== 'CanceledError' && error.name !== 'AbortError') {
          setError(error.message || 'Failed to fetch places');
        }
      } finally {
        setIsLoading(false);
        setIsFetchingMore(false);
      }
    };

    const debounceTimer = setTimeout(syncUrlAndFetch, 350);
    return () => clearTimeout(debounceTimer);
  }, [
    store.currentPage,
    store.perPage,
    store.search,
    store.activeCategory,
    store.activeCities,
    store.activeBudgets,
    store.activeSeason,
    store.activeCrowdLevel,
    store.activeSuitableFor,
    store.activeAge,
    store.sortBy,
    router
  ]);

  return { places, meta, isLoading, isFetchingMore, error };
}
