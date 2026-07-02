"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import type { Review } from "@/types/places";
import { StarRating } from "./StarRating";

interface PlaceRatingOverviewProps {
  rating: number;
  reviews: Review[];
  totalReviews: number;
  embedded?: boolean;
}

function getRatingDistribution(reviews: Review[]): number[] {
  const counts = [0, 0, 0, 0, 0];
  reviews.forEach((review) => {
    if (review.rating >= 1 && review.rating <= 5) {
      counts[review.rating - 1]++;
    }
  });
  return [5, 4, 3, 2, 1].map((star) => counts[star - 1]);
}

export function PlaceRatingOverview({
  rating,
  reviews,
  totalReviews,
  embedded = false,
}: PlaceRatingOverviewProps) {
  const distribution = getRatingDistribution(reviews);

  const content = (
    <div className="grid gap-8 md:grid-cols-[180px_1fr] md:items-center">
      <div>
        <div className="flex items-end gap-2">
          <span className="text-4xl font-bold text-[#DFD616]">
            {rating > 0 ? rating.toFixed(1) : "—"}
          </span>
          <span className="mb-1 text-sm text-[#555]">/ 5</span>
        </div>
        <StarRating rating={rating} size={16} className="mt-2" />
        <p className="mt-2 text-sm text-[#666]">
          {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
        </p>
      </div>

      <div className="space-y-2">
        {distribution.map((count, index) => {
          const stars = 5 - index;
          const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

          return (
            <motion.div
              key={stars}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.04 }}
              className="flex items-center gap-3"
            >
              <span className="flex w-7 items-center gap-1 text-xs text-[#888]">
                {stars}
                <Star size={10} className="text-[#DFD616]" fill="currentColor" />
              </span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#141414]">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${percentage}%` }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    delay: 0.08 + index * 0.05,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="h-full rounded-full bg-[#DFD616]"
                />
              </div>
              <span className="w-6 text-right text-xs text-[#555]">{count}</span>
            </motion.div>
          );
        })}
        {reviews.length === 0 && (
          <p className="text-sm text-[#555]">No rating breakdown yet.</p>
        )}
      </div>
    </div>
  );

  if (embedded) {
    return (
      <div className="border-b border-[#1a1a1a] p-6 md:p-8">{content}</div>
    );
  }

  return (
    <section className="rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a] p-6 md:p-8">
      {content}
    </section>
  );
}
