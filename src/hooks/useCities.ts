import { useEffect, useState } from "react";
import { placesService } from "@/services/places.service";

export function useCities() {
  const [cities, setCities] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await placesService.getCities();
        const data = response.data || [];
        const names = data.map((item) => (typeof item === "string" ? item : item.city));
        setCities(names.filter(Boolean));
      } catch {
        setCities(["Cairo", "Giza", "Luxor", "Aswan"]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCities();
  }, []);

  return { cities, isLoading };
}
