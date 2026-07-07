import { create } from 'zustand';

// TODO: Backend currently reads suitable_for and suitable_age as single strings (c.Query).
// If we want multi-select in the future, the backend must be updated to split on comma
// and use an IN query. For now, we enforce single-select behavior in the frontend store.

interface PlacesState {
  // Pagination
  currentPage: number;
  perPage: number;
  
  // Filters
  search: string;
  activeCategory: string;
  activeCities: string[];
  activeBudgets: string[];
  
  // Single-select filters (to match backend c.Query)
  activeSeason: string;
  activeCrowdLevel: string;
  activeSuitableFor: string;
  activeAge: string;
  
  // Sorting
  sortBy: string;

  // Actions
  setCurrentPage: (page: number | ((prev: number) => number)) => void;
  setSearch: (search: string) => void;
  setCategory: (category: string) => void;
  toggleCity: (city: string) => void;
  toggleBudget: (budget: string) => void;
  
  setSeason: (season: string) => void;
  setCrowdLevel: (level: string) => void;
  setSuitableFor: (suitable: string) => void;
  setAge: (age: string) => void;
  
  setSortBy: (sort: string) => void;
  resetFilters: () => void;
  setFiltersFromURL: (params: URLSearchParams) => void;
}

export const usePlacesStore = create<PlacesState>((set) => ({
  currentPage: 1,
  perPage: 15,
  search: "",
  activeCategory: "all",
  activeCities: [],
  activeBudgets: [],
  activeSeason: "",
  activeCrowdLevel: "",
  activeSuitableFor: "",
  activeAge: "",
  sortBy: "rating",

  setCurrentPage: (page) => set((state) => ({ 
    currentPage: typeof page === 'function' ? page(state.currentPage) : page 
  })),
  setSearch: (search) => set({ search, currentPage: 1 }),
  setCategory: (category) => set({ activeCategory: category, currentPage: 1 }),
  
  toggleCity: (city) => set((state) => ({
    activeCities: state.activeCities.includes(city)
      ? state.activeCities.filter((c) => c !== city)
      : [...state.activeCities, city],
    currentPage: 1
  })),
  
  toggleBudget: (budget) => set((state) => ({
    activeBudgets: state.activeBudgets.includes(budget)
      ? state.activeBudgets.filter((b) => b !== budget)
      : [...state.activeBudgets, budget],
    currentPage: 1
  })),

  // Single select toggles (click again to clear)
  setSeason: (season) => set((state) => ({
    activeSeason: state.activeSeason === season ? "" : season,
    currentPage: 1
  })),

  setCrowdLevel: (level) => set((state) => ({
    activeCrowdLevel: state.activeCrowdLevel === level ? "" : level,
    currentPage: 1
  })),

  setSuitableFor: (suitable) => set((state) => ({
    activeSuitableFor: state.activeSuitableFor === suitable ? "" : suitable,
    currentPage: 1
  })),

  setAge: (age) => set((state) => ({
    activeAge: state.activeAge === age ? "" : age,
    currentPage: 1
  })),

  setSortBy: (sort) => set({ sortBy: sort, currentPage: 1 }),

  resetFilters: () => set({
    currentPage: 1,
    search: "",
    activeCategory: "all",
    activeCities: [],
    activeBudgets: [],
    activeSeason: "",
    activeCrowdLevel: "",
    activeSuitableFor: "",
    activeAge: "",
    sortBy: "rating",
  }),

  setFiltersFromURL: (params: URLSearchParams) => {
    const page = parseInt(params.get('page') || '1', 10);
    const perPage = parseInt(params.get('per_page') || '15', 10);
    
    const cities = params.getAll('cities[]');
    const budgets = params.getAll('budget_level[]');
    
    set({
      currentPage: isNaN(page) ? 1 : page,
      perPage: isNaN(perPage) ? 15 : perPage,
      search: params.get('search') || "",
      activeCategory: params.get('category') || "all",
      activeCities: cities.length ? cities : [],
      activeBudgets: budgets.length ? budgets : [],
      activeSeason: params.get('best_season') || "",
      activeCrowdLevel: params.get('crowd_level') || "",
      activeSuitableFor: params.get('suitable_for') || "",
      activeAge: params.get('suitable_age') || "",
      sortBy: params.get('sort_by') || "rating",
    });
  }
}));
