import { notFound } from "next/navigation";
import { placesService } from "@/services/places.service";
import { PlaceDetailsView } from "./components/PlaceDetailsView";

export default async function PlaceDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const placeId = parseInt(id, 10);

  if (isNaN(placeId)) {
    notFound();
  }

  let place;
  try {
    const response = await placesService.getPlaceById(placeId);
    place = response.data;
  } catch {
    notFound();
  }

  const [reviewsResult, relatedResult, cityResult] = await Promise.allSettled([
    placesService.getPlaceReviews(placeId, { page: 1, per_page: 10 }),
    placesService.getPlaces({ category: place.category, per_page: 15 }),
    placesService.getPlaces({ city: place.city, per_page: 12 }),
  ]);

  const reviews =
    reviewsResult.status === "fulfilled" ? reviewsResult.value.data : [];
  const reviewsMeta =
    reviewsResult.status === "fulfilled" ? reviewsResult.value.meta : undefined;

  const getTopPlaces = (placesData: any[] | undefined, excludeId: number) => {
    return (placesData ?? [])
      .filter((p) => p.id !== excludeId)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 8);
  };

  const relatedPlaces =
    relatedResult.status === "fulfilled"
      ? getTopPlaces(relatedResult.value.data, place.id)
      : [];

  const cityPlaces =
    cityResult.status === "fulfilled"
      ? getTopPlaces(cityResult.value.data, place.id)
      : [];

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
      <PlaceDetailsView
        place={place}
        reviews={reviews}
        reviewsMeta={reviewsMeta}
        relatedPlaces={relatedPlaces}
        cityPlaces={cityPlaces}
      />
    </div>
  );
}
