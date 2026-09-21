// client/src/features/patient/components/DoctorCard.tsx
import React, { memo } from 'react';
import { cn } from '../../../lib/utils';
import { Card, CardContent } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { RatingStars } from './RatingStars';
import type { Doctor, DoctorStatus } from '../../../types/patient/doctor.types';

// ============================================================================
// TYPES
// ============================================================================

export type DoctorCardVariant = 'default' | 'compact' | 'detailed';

export interface DoctorCardProps {
  /** Doctor data */
  doctor: Doctor;
  /** Card variant */
  variant?: DoctorCardVariant;
  /** Whether the doctor is in favorites list */
  isFavorite?: boolean;
  /** Callback when favorite button is clicked */
  onFavoriteClick?: (doctorId: string, isFavorite: boolean) => void;
  /** Callback when book button is clicked */
  onBookClick?: (doctorId: string) => void;
  /** Callback when card is clicked (navigation) */
  onClick?: (doctorId: string) => void;
  /** Additional CSS classes */
  className?: string;
  /** Whether to show book button */
  showBookButton?: boolean;
  /** Whether to show favorite button */
  showFavoriteButton?: boolean;
  /** Loading state */
  isLoading?: boolean;
}

// ============================================================================
// STATUS CONFIGURATION
// ============================================================================

const STATUS_CONFIG: Record<DoctorStatus, { label: string; variant: 'success' | 'warning' | 'danger' | 'info' | 'default' }> = {
  AVAILABLE: { label: 'Available', variant: 'success' },
  BUSY: { label: 'Busy', variant: 'warning' },
  ACTIVE: { label: 'Active', variant: 'success' },
  ON_LEAVE: { label: 'On Leave', variant: 'danger' },
  INACTIVE: { label: 'Inactive', variant: 'default' },
  AWAY: { label: 'Away', variant: 'warning' },
  OFFLINE: { label: 'Offline', variant: 'default' },
};

// ============================================================================
// SKELETON LOADER
// ============================================================================

const DoctorCardSkeleton: React.FC = () => (
  <Card className="animate-pulse">
    <CardContent className="p-4">
      <div className="flex gap-4">
        <div className="h-20 w-20 rounded-full bg-gray-200 dark:bg-gray-700" />
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
// MAIN COMPONENT
// ============================================================================

export const DoctorCard: React.FC<DoctorCardProps> = memo(({
  doctor,
  variant = 'default',
  isFavorite = false,
  onFavoriteClick,
  onBookClick,
  onClick,
  className = '',
  showBookButton = true,
  showFavoriteButton = true,
  isLoading = false,
}) => {
  if (isLoading) {
    return <DoctorCardSkeleton />;
  }

  const handleCardClick = () => {
    if (onClick) {
      onClick(doctor.id);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFavoriteClick?.(doctor.id, isFavorite);
  };

  const handleBookClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBookClick?.(doctor.id);
  };

  const statusConfig = STATUS_CONFIG[doctor.status] || STATUS_CONFIG.INACTIVE;

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
            <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
              {doctor.profilePicture ? (
                <img
                  src={doctor.profilePicture}
                  alt={doctor.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-lg font-medium text-gray-500">
                  {doctor.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="truncate text-sm font-medium text-gray-900 dark:text-white">
                {doctor.name}
              </h4>
              <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                {doctor.specialization}
              </p>
              <RatingStars rating={doctor.rating} size="xs" showNumeric={false} />
            </div>
            {showBookButton && (
              <Button size="sm" onClick={handleBookClick} className="flex-shrink-0">
                Book
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
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="h-24 w-24 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                {doctor.profilePicture ? (
                  <img
                    src={doctor.profilePicture}
                    alt={doctor.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-2xl font-medium text-gray-500">
                    {doctor.name.charAt(0)}
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {doctor.name}
                </h3>
                <Badge variant={statusConfig.variant}>
                  {statusConfig.label}
                </Badge>
              </div>
              
              <p className="mb-1 text-gray-600 dark:text-gray-300">
                {doctor.specialization}
              </p>
              
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                {doctor.experience} years experience • {doctor.qualifications?.join(', ')}
              </p>
              
              <RatingStars rating={doctor.rating} totalReviews={doctor.totalReviews} size="sm" />
              
              {doctor.bio && (
                <p className="mt-3 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                  {doctor.bio}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-shrink-0 flex-row gap-2 md:flex-col md:items-end">
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                ₹{doctor.consultationFee.toLocaleString()}
              </p>
              {showBookButton && (
                <Button onClick={handleBookClick}>Book Appointment</Button>
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
          {/* Avatar */}
          <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
            {doctor.profilePicture ? (
              <img
                src={doctor.profilePicture}
                alt={doctor.name}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-lg font-medium text-gray-500">
                {doctor.name.charAt(0)}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
              <h4 className="font-medium text-gray-900 dark:text-white">
                {doctor.name}
              </h4>
              <Badge variant={statusConfig.variant} className="text-xs">
                {statusConfig.label}
              </Badge>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {doctor.specialization}
            </p>
            
            <div className="mt-1 flex items-center justify-between">
              <RatingStars rating={doctor.rating} size="xs" showNumeric={false} />
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                ₹{doctor.consultationFee.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-shrink-0 flex-col gap-1">
            {showBookButton && (
              <Button size="sm" onClick={handleBookClick}>
                Book
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

DoctorCard.displayName = 'DoctorCard';

export default DoctorCard;