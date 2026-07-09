"use client";

import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  className?: string;
}

export function StarRating({
  rating,
  max = 5,
  size = 16,
  interactive = false,
  onChange,
  className = "",
}: StarRatingProps) {
  return (
    <div className={`inline-flex items-center gap-0.5 ${className}`}>
      {Array.from({ length: max }, (_, index) => {
        const starValue = index + 1;
        const filled = interactive
          ? starValue <= rating
          : starValue <= Math.round(rating);

        if (interactive) {
          return (
            <button
              key={starValue}
              type="button"
              onClick={() => onChange?.(starValue)}
              className="text-accent transition-transform hover:scale-110 focus:outline-none"
              aria-label={`Rate ${starValue} stars`}
            >
              <Star
                size={size}
                fill={filled ? "currentColor" : "none"}
                className={filled ? "text-accent" : "text-muted/35"}
              />
            </button>
          );
        }

        return (
          <Star
            key={starValue}
            size={size}
            fill={filled ? "currentColor" : "none"}
            className={filled ? "text-accent" : "text-muted/35"}
          />
        );
      })}
    </div>
  );
}
