// src/features/public/components/filters/RatingFilter.tsx
import { Star } from "lucide-react";

interface RatingFilterProps {
  value: number;
  onChange: (value: number) => void;
}

export function RatingFilter({ value, onChange }: RatingFilterProps) {
  const ratings = [4, 3, 2, 1];

  return (
    <div className="rating-filter">
      {ratings.map((rating) => (
        <label key={rating} className="rating-filter__option">
          <input
            type="radio"
            name="rating"
            value={rating}
            checked={value === rating}
            onChange={() => onChange(rating)}
          />
          <div className="rating-filter__stars">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={14}
                className={i < rating ? 'filled' : ''}
              />
            ))}
            <span>& up</span>
          </div>
        </label>
      ))}
    </div>
  );
}