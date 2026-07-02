import { create } from 'zustand';
import { toast } from 'sonner';
import { placesService } from '@/services/places.service';
import { userService } from '@/services/user.service';
import type { SavedPlaceProfile } from '@/types/user';

interface SavedPlacesMeta {
  page: number;
  per_page: number;
  total: number;
}

interface SavedPlacesState {
  savedIds: Record<number, boolean>;
  places: SavedPlaceProfile[];
  meta: SavedPlacesMeta;
  isLoadingList: boolean;
  togglingIds: Record<number, boolean>;
  isHydrated: boolean;

  isSaved: (placeId: number) => boolean;
  isToggling: (placeId: number) => boolean;
  fetchSavedPlaces: ({ page, perPage }: { page?: number; perPage?: number }) => Promise<void>;
  hydrateSavedIds: () => Promise<void>;
  toggleSave: ({ placeId }: { placeId: number }) => Promise<boolean>;
  unsaveFromProfile: ({ placeId }: { placeId: number }) => Promise<void>;
  reset: () => void;
}

const initialMeta: SavedPlacesMeta = { page: 1, per_page: 10, total: 0 };

export const useSavedPlacesStore = create<SavedPlacesState>((set, get) => ({
  savedIds: {},
  places: [],
  meta: initialMeta,
  isLoadingList: false,
  togglingIds: {},
  isHydrated: false,

  isSaved: (placeId) => Boolean(get().savedIds[placeId]),

  isToggling: (placeId) => Boolean(get().togglingIds[placeId]),

  fetchSavedPlaces: async ({ page = 1, perPage = 10 }) => {
    set({ isLoadingList: true });
    try {
      const response = await userService.getSavedPlaces({ page, perPage });
      const savedIds = { ...get().savedIds };
      response.data.forEach((item) => {
        savedIds[item.place_id] = true;
      });

      set({
        places: response.data,
        meta: response.meta,
        savedIds,
        isHydrated: true,
      });
    } catch (error) {
      console.error('Failed to fetch saved places', error);
    } finally {
      set({ isLoadingList: false });
    }
  },

  hydrateSavedIds: async () => {
    if (get().isHydrated) return;
    try {
      const response = await userService.getSavedPlaces({ page: 1, perPage: 50 });
      const savedIds = { ...get().savedIds };
      response.data.forEach((item) => {
        savedIds[item.place_id] = true;
      });
      set({ savedIds, isHydrated: true });
    } catch (error) {
      console.error('Failed to hydrate saved place IDs', error);
    }
  },

  toggleSave: async ({ placeId }) => {
    const currentlySaved = get().isSaved(placeId);
    set((state) => ({
      togglingIds: { ...state.togglingIds, [placeId]: true },
    }));

    try {
      if (currentlySaved) {
        await placesService.unsavePlace(placeId);
        set((state) => {
          const savedIds = { ...state.savedIds };
          delete savedIds[placeId];
          return {
            savedIds,
            places: state.places.filter((p) => p.place_id !== placeId),
            meta: { ...state.meta, total: Math.max(0, state.meta.total - 1) },
          };
        });
        toast.success('Place removed from saved');
        return false;
      }

      await placesService.savePlace(placeId);
      set((state) => ({
        savedIds: { ...state.savedIds, [placeId]: true },
        meta: { ...state.meta, total: state.meta.total + 1 },
      }));
      toast.success('Place saved successfully');
      return true;
    } catch (error) {
      console.error('Failed to toggle save status', error);
      toast.error('Something went wrong. Please try again.');
      throw error;
    } finally {
      set((state) => {
        const togglingIds = { ...state.togglingIds };
        delete togglingIds[placeId];
        return { togglingIds };
      });
    }
  },

  unsaveFromProfile: async ({ placeId }) => {
    await get().toggleSave({ placeId });
  },

  reset: () =>
    set({
      savedIds: {},
      places: [],
      meta: initialMeta,
      isLoadingList: false,
      togglingIds: {},
      isHydrated: false,
    }),
}));
