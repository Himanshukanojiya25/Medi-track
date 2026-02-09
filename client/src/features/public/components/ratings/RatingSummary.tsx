// src/features/public/components/rating/RatingSummary.tsx

import { RatingStars } from "./RatingStars";

type RatingSummaryProps = {
  rating: number;
  reviewsCount?: number;
};

export function RatingSummary({
  rating,
  reviewsCount,
}: RatingSummaryProps) {
  return (
    <div className="rating-summary">
      <RatingStars value={rating} />
      <span className="rating-summary__text">
        {rating.toFixed(1)}
        {reviewsCount !== undefined && (
          <> ({reviewsCount} reviews)</>
        )}
      </span>
    </div>
  );
}
