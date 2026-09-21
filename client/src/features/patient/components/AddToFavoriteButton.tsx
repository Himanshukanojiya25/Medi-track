// client/src/features/patient/components/AddToFavoriteButton.tsx
import React, { useState, useCallback } from 'react';
import { cn } from '../../../lib/utils';
import { Button } from '../../../components/ui/button';
import { toast } from '../../../components/ui/toast';

// ============================================================================
// TYPES
// ============================================================================

export type FavoriteType = 'DOCTOR' | 'HOSPITAL';

export interface AddToFavoriteButtonProps {
  /** ID of the entity (doctor or hospital) */
  entityId: string;
  /** Type of entity */
  entityType: FavoriteType;
  /** Whether the entity is currently favorited */
  isFavorite: boolean;
  /** Callback when favorite status changes */
  onToggle?: (entityId: string, isFavorite: boolean) => Promise<void> | void;
  /** Button variant */
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  /** Button size */
  size?: 'default' | 'sm' | 'lg' | 'icon';
  /** Whether to show text label */
  showLabel?: boolean;
  /** Custom label when favorited */
  favoriteLabel?: string;
  /** Custom label when not favorited */
  unfavoriteLabel?: string;
  /** Additional CSS classes */
  className?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Loading state (overrides internal) */
  loading?: boolean;
  /** Toast message on success */
  successMessage?: string;
  /** Toast message on error */
  errorMessage?: string;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const AddToFavoriteButton: React.FC<AddToFavoriteButtonProps> = ({
  entityId,
  entityType,
  isFavorite: initialIsFavorite,
  onToggle,
  variant = 'ghost',
  size = 'sm',
  showLabel = true,
  favoriteLabel = 'Saved',
  unfavoriteLabel = 'Save',
  className = '',
  disabled = false,
  loading: externalLoading = false,
  successMessage,
  errorMessage = 'Failed to update favorites. Please try again.',
}) => {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isLoading, setIsLoading] = useState(false);

  const isBusy = externalLoading || isLoading;

  const handleClick = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isBusy || disabled) return;

    setIsLoading(true);

    try {
      if (onToggle) {
        await onToggle(entityId, isFavorite);
      }
      
      setIsFavorite(!isFavorite);
      
      // Show success toast
      const defaultSuccessMessage = !isFavorite
        ? `Added to ${entityType === 'DOCTOR' ? 'favorite doctors' : 'favorite hospitals'}`
        : `Removed from ${entityType === 'DOCTOR' ? 'favorite doctors' : 'favorite hospitals'}`;
      
      toast({
        title: !isFavorite ? 'Added to favorites' : 'Removed from favorites',
        description: successMessage || defaultSuccessMessage,
        variant: 'default',
      });
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [entityId, isFavorite, isBusy, disabled, onToggle, entityType, successMessage, errorMessage]);

  // ============================================================================
  // ICON RENDERER
  // ============================================================================
  const renderIcon = () => {
    if (isBusy) {
      return (
        <svg
          className="h-4 w-4 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      );
    }

    return (
      <svg
        className={cn(
          'h-4 w-4 transition-all duration-200',
          isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-500',
        )}
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
    );
  };

  // ============================================================================
  // RENDER
  // ============================================================================
  if (size === 'icon') {
    return (
      <Button
        variant={variant}
        size="icon"
        onClick={handleClick}
        disabled={isBusy || disabled}
        className={cn('h-8 w-8', className)}
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        {renderIcon()}
      </Button>
    );
  }

  return (
    <Button
      variant={isFavorite ? 'default' : variant}
      size={size}
      onClick={handleClick}
      disabled={isBusy || disabled}
      className={cn('gap-1.5', className)}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      {renderIcon()}
      {showLabel && (isFavorite ? favoriteLabel : unfavoriteLabel)}
    </Button>
  );
};

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default AddToFavoriteButton;