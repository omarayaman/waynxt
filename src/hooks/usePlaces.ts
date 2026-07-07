import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePlacesStore } from '@/store/usePlacesStore';
import { placesService } from '@/services/places.service';
import { Place, PaginationMeta, PlacesFilters } from '@/types/places';

const PLACES_PER_PAGE = 15;

function buildFiltersFromStore(store: ReturnType<typeof usePlacesStore.getState>): PlacesFilters {
  return {
    page: 1,
    per_page: PLACES_PER_PAGE,
    search: store.search,
    category: store.activeCategory,
    city: store.activeCities,
    budget_level: store.activeBudgets,
    best_season: store.activeSeason,
    crowd_level: store.activeCrowdLevel,
    suitable_for: store.activeSuitableFor,
    suitable_age: store.activeAge,
    sort_by: store.sortBy,
  };
}

function syncUrlFromStore({
  router,
  store,
}: {
  router: ReturnType<typeof useRouter>;
  store: ReturnType<typeof usePlacesStore.getState>;
}) {
  const params = new URLSearchParams();

  if (store.search) params.append('search', store.search);
  if (store.activeCategory && store.activeCategory !== 'all') {
    params.append('category', store.activeCategory);
  }
  if (store.activeSeason) params.append('best_season', store.activeSeason);
  if (store.activeCrowdLevel) params.append('crowd_level', store.activeCrowdLevel);
  if (store.activeSuitableFor) params.append('suitable_for', store.activeSuitableFor);
  if (store.activeAge) params.append('suitable_age', store.activeAge);
  if (store.sortBy && store.sortBy !== 'rating') params.append('sort_by', store.sortBy);

  store.activeCities.forEach((c) => params.append('cities[]', c));
  store.activeBudgets.forEach((b) => params.append('budget_level[]', b));

  const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
  router.replace(newUrl, { scroll: false });
}

export function usePlaces() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const store = usePlacesStore();

  const [places, setPlaces] = useState<Place[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [animateFromIndex, setAnimateFromIndex] = useState(0);

  const pageRef = useRef(1);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isInitialized = useRef(false);
  const isLoadingMoreRef = useRef(false);

  const filterKey = useMemo(
    () =>
      JSON.stringify({
        search: store.search,
        activeCategory: store.activeCategory,
        activeCities: store.activeCities,
        activeBudgets: store.activeBudgets,
        activeSeason: store.activeSeason,
        activeCrowdLevel: store.activeCrowdLevel,
        activeSuitableFor: store.activeSuitableFor,
        activeAge: store.activeAge,
        sortBy: store.sortBy,
      }),
    [
      store.search,
      store.activeCategory,
      store.activeCities,
      store.activeBudgets,
      store.activeSeason,
      store.activeCrowdLevel,
      store.activeSuitableFor,
      store.activeAge,
      store.sortBy,
    ]
  );

  const fetchPage = useCallback(
    async ({ page, append }: { page: number; append: boolean }) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      const filters = buildFiltersFromStore(usePlacesStore.getState());
      filters.page = page;
      filters.per_page = PLACES_PER_PAGE;

      const response = await placesService.getPlaces(filters, abortControllerRef.current.signal);

      if (append) {
        setPlaces((prev) => {
          setAnimateFromIndex(prev.length);
          const existingIds = new Set(prev.map((p) => p.id));
          const newItems = response.data.filter((p) => !existingIds.has(p.id));
          return [...prev, ...newItems];
        });
      } else {
        setAnimateFromIndex(0);
        setPlaces(response.data);
      }

      if (response.meta) {
        setMeta(response.meta);
      }

      pageRef.current = page;
    },
    []
  );

  useEffect(() => {
    store.setFiltersFromURL(new URLSearchParams(searchParams.toString()));
    if (store.perPage !== PLACES_PER_PAGE) {
      usePlacesStore.setState({ perPage: PLACES_PER_PAGE, currentPage: 1 });
    }
    isInitialized.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isInitialized.current) return;

    const loadFirstPage = async () => {
      syncUrlFromStore({ router, store: usePlacesStore.getState() });
      pageRef.current = 1;
      setIsLoading(true);
      setError(null);
      setPlaces([]);

      try {
        await fetchPage({ page: 1, append: false });
      } catch (err: unknown) {
        const fetchError = err as Error;
        if (fetchError.name !== 'CanceledError' && fetchError.name !== 'AbortError') {
          setError(fetchError.message || 'Failed to fetch places');
        }
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      void loadFirstPage();
    }, 350);

    return () => clearTimeout(debounceTimer);
  }, [filterKey, router, fetchPage]);

  const hasMore = meta ? places.length < meta.total : false;

  const loadMore = useCallback(async () => {
    if (!hasMore || isLoading || isLoadingMoreRef.current) return;

    isLoadingMoreRef.current = true;
    setIsLoadingMore(true);
    setError(null);

    try {
      await fetchPage({ page: pageRef.current + 1, append: true });
    } catch (err: unknown) {
      const fetchError = err as Error;
      if (fetchError.name !== 'CanceledError' && fetchError.name !== 'AbortError') {
        setError(fetchError.message || 'Failed to load more places');
      }
    } finally {
      isLoadingMoreRef.current = false;
      setIsLoadingMore(false);
    }
  }, [hasMore, isLoading, fetchPage]);

  return {
    places,
    meta,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    loadMore,
    animateFromIndex,
  };
}
