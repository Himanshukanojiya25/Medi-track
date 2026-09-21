// client/src/features/patient/components/RatingStars.tsx
import React, { useMemo, useState } from 'react';
import { cn } from '../../../lib/utils';

// ============================================================================
// TYPES
// ============================================================================

export type RatingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface RatingStarsProps {
  /** Rating value from 0 to 5 (supports decimals like 4.5) */
  rating: number;
  /** Total number of reviews (optional, shown in parentheses) */
  totalReviews?: number;
  /** Size of stars */
  size?: RatingSize;
  /** Whether to show the numeric rating value */
  showNumeric?: boolean;
  /** Whether the rating is interactive (clickable) */
  interactive?: boolean;
  /** Callback when rating changes (only if interactive) */
  onRatingChange?: (rating: number) => void;
  /** Additional CSS classes */
  className?: string;
  /** Whether to disable user interaction */
  disabled?: boolean;
  /** Whether to show half-star precision */
  halfPrecision?: boolean;
  /** Readonly mode (no hover effects) */
  readonly?: boolean;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const SIZE_CONFIG: Record<RatingSize, { star: string; text: string; gap: string }> = {
  xs: { star: 'w-2.5 h-2.5', text: 'text-[10px]', gap: 'gap-0.5' },
  sm: { star: 'w-3.5 h-3.5', text: 'text-xs', gap: 'gap-0.5' },
  md: { star: 'w-4 h-4', text: 'text-sm', gap: 'gap-1' },
  lg: { star: 'w-5 h-5', text: 'text-base', gap: 'gap-1' },
  xl: { star: 'w-6 h-6', text: 'text-lg', gap: 'gap-1.5' },
};

// ============================================================================
// UTILITIES
// ============================================================================

const clampRating = (value: number): number => Math.min(5, Math.max(0, value));

const getStarType = (index: number, rating: number): 'full' | 'half' | 'empty' => {
  const diff = rating - index;
  if (diff >= 1) return 'full';
  if (diff > 0) return 'half';
  return 'empty';
};

const formatRating = (rating: number): string => {
  return rating % 1 === 0 ? rating.toString() : rating.toFixed(1);
};

// ============================================================================
// STAR ICON COMPONENT
// ============================================================================

interface StarIconProps {
  type: 'full' | 'half' | 'empty';
  size: string;
  interactive: boolean;
  className?: string;
}

const StarIcon: React.FC<StarIconProps> = ({ type, size, interactive, className }) => {
  const baseClasses = cn(size, className, {
    'cursor-pointer transition-all duration-150 hover:scale-110': interactive,
  });

  if (type === 'full') {
    return (
      <svg
        className={cn(baseClasses, 'text-yellow-400')}
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    );
  }

  if (type === 'half') {
    return (
      <svg
        className={cn(baseClasses, 'text-yellow-400')}
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="halfGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="50%" stopColor="currentColor" />
            <stop offset="50%" stopColor="#D1D5DB" />
          </linearGradient>
        </defs>
        <path
          fill="url(#halfGradient)"
          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
        />
      </svg>
    );
  }

  return (
    <svg
      className={cn(baseClasses, 'text-gray-300 dark:text-gray-600')}
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  totalReviews,
  size = 'md',
  showNumeric = true,
  interactive = false,
  onRatingChange,
  className = '',
  disabled = false,
  halfPrecision = true,
  readonly = false,
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  
  const clampedRating = clampRating(rating);
  const displayRating = hoverRating ?? clampedRating;
  const isInteractive = interactive && !disabled && !readonly;

  const stars = useMemo(() => {
    const ratingValue = halfPrecision ? displayRating : Math.round(displayRating);
    return Array.from({ length: 5 }, (_, i) => ({
      index: i,
      type: getStarType(i, ratingValue),
    }));
  }, [displayRating, halfPrecision]);

  const handleMouseEnter = (index: number) => {
    if (!isInteractive) return;
    setHoverRating(index + 1);
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    if (!isInteractive) return;
    setHoverRating(null);
    setIsHovering(false);
  };

  const handleClick = (index: number) => {
    if (!isInteractive || !onRatingChange) return;
    const newRating = halfPrecision ? index + 1 : Math.ceil(index + 1);
    onRatingChange(Math.min(5, newRating));
  };

  const handleHalfStarClick = (event: React.MouseEvent, index: number) => {
    event.stopPropagation();
    if (!isInteractive || !onRatingChange || !halfPrecision) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const isHalf = event.clientX - rect.left < rect.width / 2;
    const newRating = isHalf ? index + 0.5 : index + 1;
    onRatingChange(Math.min(5, newRating));
  };

  return (
    <div
      className={cn('inline-flex items-center gap-2', className)}
      onMouseLeave={handleMouseLeave}
    >
      <div className={cn('flex', SIZE_CONFIG[size].gap)}>
        {stars.map((star, idx) => (
          <div
            key={idx}
            className="relative inline-block"
            onMouseEnter={() => handleMouseEnter(idx)}
            onClick={() => handleClick(idx)}
          >
            <StarIcon
              type={star.type}
              size={SIZE_CONFIG[size].star}
              interactive={isInteractive}
            />
            {halfPrecision && isInteractive && (
              <div
                className="absolute inset-0 left-0 w-1/2 cursor-pointer"
                onClick={(e) => handleHalfStarClick(e, idx)}
              />
            )}
          </div>
        ))}
      </div>
      
      {(showNumeric || totalReviews !== undefined) && (
        <div className={cn('flex items-center gap-1 text-gray-600 dark:text-gray-400', SIZE_CONFIG[size].text)}>
          {showNumeric && (
            <span className="font-medium text-gray-900 dark:text-white">
              {formatRating(clampedRating)}
            </span>
          )}
          {totalReviews !== undefined && (
            <span>
              ({totalReviews.toLocaleString()} {totalReviews === 1 ? 'review' : 'reviews'})
            </span>
          )}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default RatingStars;