// client/src/features/patient/components/HospitalCard.tsx
import React, { memo } from 'react';
import { cn } from '../../../lib/utils';
import { Card, CardContent } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { RatingStars } from './RatingStars';
import type { Hospital } from '../../../types/patient/hospital.types';

// ============================================================================
// TYPES
// ============================================================================

export type HospitalCardVariant = 'default' | 'compact' | 'detailed';

export interface HospitalCardProps {
  /** Hospital data */
  hospital: Hospital;
  /** Card variant */
  variant?: HospitalCardVariant;
  /** Whether the hospital is in favorites list */
  isFavorite?: boolean;
  /** Callback when favorite button is clicked */
  onFavoriteClick?: (hospitalId: string, isFavorite: boolean) => void;
  /** Callback when view details button is clicked */
  onViewDetailsClick?: (hospitalId: string) => void;
  /** Callback when card is clicked (navigation) */
  onClick?: (hospitalId: string) => void;
  /** Additional CSS classes */
  className?: string;
  /** Whether to show view details button */
  showViewDetailsButton?: boolean;
  /** Whether to show favorite button */
  showFavoriteButton?: boolean;
  /** Loading state */
  isLoading?: boolean;
}

// ============================================================================
// SKELETON LOADER
// ============================================================================

const HospitalCardSkeleton: React.FC = () => (
  <Card className="animate-pulse">
    <CardContent className="p-4">
      <div className="flex gap-4">
        <div className="h-16 w-16 rounded-lg bg-gray-200 dark:bg-gray-700" />
        <div className="flex-1 space-y-2">
          <div className="h-5 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-4 w-1/3 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
    </CardContent>
  </Card>
);

// ============================================================================
// VERIFIED BADGE
// ============================================================================

const VerifiedBadge: React.FC = () => (
  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
    Verified
  </span>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const HospitalCard: React.FC<HospitalCardProps> = memo(({
  hospital,
  variant = 'default',
  isFavorite = false,
  onFavoriteClick,
  onViewDetailsClick,
  onClick,
  className = '',
  showViewDetailsButton = true,
  showFavoriteButton = true,
  isLoading = false,
}) => {
  if (isLoading) {
    return <HospitalCardSkeleton />;
  }

  const handleCardClick = () => {
    if (onClick) {
      onClick(hospital.id);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFavoriteClick?.(hospital.id, isFavorite);
  };

  const handleViewDetailsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onViewDetailsClick?.(hospital.id);
  };

  // ============================================================================
  // COMPACT VARIANT
  // ============================================================================
  if (variant === 'compact') {
    return (
      <Card
        className={cn(
          'cursor-pointer transition-all duration-200 hover:shadow-md',
          className,
        )}
        onClick={handleCardClick}
      >
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
              {hospital.logo ? (
                <img
                  src={hospital.logo}
                  alt={hospital.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-lg font-medium text-gray-500">
                  {hospital.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="truncate text-sm font-medium text-gray-900 dark:text-white">
                {hospital.name}
              </h4>
              <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                {hospital.city}, {hospital.state}
              </p>
              <RatingStars rating={hospital.rating} size="xs" showNumeric={false} />
            </div>
            {showViewDetailsButton && (
              <Button size="sm" variant="outline" onClick={handleViewDetailsClick}>
                View
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // ============================================================================
  // DETAILED VARIANT
  // ============================================================================
  if (variant === 'detailed') {
    return (
      <Card
        className={cn(
          'cursor-pointer transition-all duration-200 hover:shadow-lg',
          className,
        )}
        onClick={handleCardClick}
      >
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 md:flex-row">
            {/* Logo */}
            <div className="flex-shrink-0">
              <div className="h-24 w-24 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                {hospital.logo ? (
                  <img
                    src={hospital.logo}
                    alt={hospital.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-2xl font-medium text-gray-500">
                    {hospital.name.charAt(0)}
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {hospital.name}
                  </h3>
                  {hospital.isVerified && <VerifiedBadge />}
                </div>
              </div>
              
              <p className="mb-1 text-gray-600 dark:text-gray-300">
                {hospital.address}, {hospital.city}, {hospital.state} - {hospital.pincode}
              </p>
              
              <div className="mb-2 flex flex-wrap gap-2">
                {hospital.specializations?.slice(0, 3).map((spec) => (
                  <span
                    key={spec}
                    className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                  >
                    {spec}
                  </span>
                ))}
                {hospital.specializations?.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{hospital.specializations.length - 3} more
                  </span>
                )}
              </div>
              
              <RatingStars rating={hospital.rating} totalReviews={hospital.totalReviews} size="sm" />
            </div>

            {/* Actions */}
            <div className="flex flex-shrink-0 flex-row gap-2 md:flex-col md:items-end">
              {showViewDetailsButton && (
                <Button onClick={handleViewDetailsClick}>View Details</Button>
              )}
              {showFavoriteButton && (
                <Button
                  variant={isFavorite ? 'default' : 'outline'}
                  size="sm"
                  onClick={handleFavoriteClick}
                  className="gap-1"
                >
                  <svg
                    className={cn('h-4 w-4', isFavorite ? 'fill-current' : '')}
                    fill={isFavorite ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  {isFavorite ? 'Saved' : 'Save'}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // ============================================================================
  // DEFAULT VARIANT
  // ============================================================================
  return (
    <Card
      className={cn(
        'cursor-pointer transition-all duration-200 hover:shadow-md',
        className,
      )}
      onClick={handleCardClick}
    >
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Logo */}
          <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
            {hospital.logo ? (
              <img
                src={hospital.logo}
                alt={hospital.name}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-lg font-medium text-gray-500">
                {hospital.name.charAt(0)}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <h4 className="font-medium text-gray-900 dark:text-white">
                {hospital.name}
              </h4>
              {hospital.isVerified && <VerifiedBadge />}
            </div>
            
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {hospital.city}, {hospital.state}
            </p>
            
            <div className="mt-1 flex items-center justify-between">
              <RatingStars rating={hospital.rating} size="xs" showNumeric={false} />
              <span className="text-xs text-gray-500">
                {hospital.totalDoctors} doctors
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-shrink-0 flex-col gap-1">
            {showViewDetailsButton && (
              <Button size="sm" variant="outline" onClick={handleViewDetailsClick}>
                View
              </Button>
            )}
            {showFavoriteButton && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleFavoriteClick}
                className="h-8 w-8"
              >
                <svg
                  className={cn('h-4 w-4', isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400')}
                  fill={isFavorite ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

HospitalCard.displayName = 'HospitalCard';

export default HospitalCard;