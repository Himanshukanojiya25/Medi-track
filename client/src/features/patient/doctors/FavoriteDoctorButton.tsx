// client/src/features/patient/doctors/FavoriteDoctorButton.tsx
import React, { useState, useCallback } from 'react';
import { Heart } from 'lucide-react';

export interface FavoriteDoctorButtonProps {
  doctorId: string;
  isFavorite: boolean;
  onToggle: (doctorId: string, isCurrentlyFavorite: boolean) => Promise<void>;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const FavoriteDoctorButton: React.FC<FavoriteDoctorButtonProps> = ({
  doctorId,
  isFavorite: initialIsFavorite,
  onToggle,
  size = 'md',
  showLabel = false,
  className = '',
}) => {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      await onToggle(doctorId, isFavorite);
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    } finally {
      setIsLoading(false);
    }
  }, [doctorId, isFavorite, isLoading, onToggle]);

  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-2.5',
  };

  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 22,
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`rounded-full transition-all ${
        isFavorite 
          ? 'bg-red-50 text-red-600 hover:bg-red-100' 
          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
      } ${sizeClasses[size]} ${className}`}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      {isLoading ? (
        <div className={`w-${iconSizes[size]} h-${iconSizes[size]} border-2 border-gray-300 border-t-transparent rounded-full animate-spin`} />
      ) : (
        <Heart size={iconSizes[size]} fill={isFavorite ? 'currentColor' : 'none'} />
      )}
      {showLabel && (
        <span className="ml-2 text-sm">{isFavorite ? 'Saved' : 'Save'}</span>
      )}
    </button>
  );
};