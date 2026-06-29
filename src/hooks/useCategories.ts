import { useEffect, useState } from 'react';
import { placesService } from '@/services/places.service';
import { Category } from '@/types/places';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await placesService.getCategories();
        setCategories(response.data || []);
      } catch (err: unknown) {
        const error = err as Error;
        setError(error.message || 'Failed to fetch categories');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, isLoading, error };
}
