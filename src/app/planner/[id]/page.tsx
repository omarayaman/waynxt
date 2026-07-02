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
        <div className="min-h-screen bg-[#090909] flex items-center justify-center">
          <Loader2 size={24} className="animate-spin text-[#555]" />
        </div>
      }
    >
      <TripDetailContent tripId={resolvedParams.id} />
    </Suspense>
  );
}
