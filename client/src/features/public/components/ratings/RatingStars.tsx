// src/features/public/components/rating/RatingStars.tsx

type RatingStarsProps = {
  value: number;          // 0–5
  max?: number;           // default 5
};

export function RatingStars({ value, max = 5 }: RatingStarsProps) {
  const safeValue = Math.max(0, Math.min(value, max));

  return (
    <span
      className="rating-stars"
      aria-label={`Rating ${safeValue} out of ${max}`}
      role="img"
    >
      {Array.from({ length: max }).map((_, index) => (
        <span key={index} aria-hidden="true">
          {index < safeValue ? "★" : "☆"}
        </span>
      ))}
    </span>
  );
}
