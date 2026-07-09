"use client";

import React, { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { TripDetailView } from "./components/TripDetailView";

interface TripDetailPageProps {
  params: Promise<{ id: string }>;
}

function TripDetailContent({ tripId }: { tripId: string }) {
  return <TripDetailView tripId={tripId} />;
}

export default function TripDetailPage({ params }: TripDetailPageProps) {
  const resolvedParams = React.use(params);

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background overflow-y-auto">
          <Loader2 size={24} className="animate-spin text-muted" />
        </div>
      }
    >
      <TripDetailContent tripId={resolvedParams.id} />
    </Suspense>
  );
}
