// client/src/features/patient/hospitals/HospitalListView.tsx

import React from 'react';
import { Building2 } from 'lucide-react'; // ✅ FIX: missing import
import { HospitalCard } from './HospitalCard';
import type { Hospital } from '../../../types/patient/hospital.types';

interface HospitalListViewProps {
  hospitals: Hospital[];
  favoriteHospitalIds: Set<string>;
  isLoading?: boolean;
  onFavoriteClick?: (hospitalId: string) => void;
  onBookClick?: (hospitalId: string) => void;
  onViewDetails?: (hospitalId: string) => void;
  variant?: 'default' | 'compact';
  emptyMessage?: string;
  emptySubMessage?: string;
}

/* -------------------------------- Skeleton Loader -------------------------------- */

const SkeletonLoader: React.FC = () => (
  <div className="space-y-4">
    {Array.from({ length: 3 }).map((_, i) => (
      <div
        key={i}
        className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse"
      >
        <div className="flex gap-4">
          <div className="w-20 h-20 rounded-xl bg-gray-200" />
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-gray-200 rounded w-1/3" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

/* -------------------------------- Empty State -------------------------------- */

const EmptyState: React.FC<{
  message: string;
  subMessage: string;
}> = ({ message, subMessage }) => (
  <div className="text-center py-12">
    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
      <Building2 size={32} className="text-gray-400" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{message}</h3>
    <p className="text-gray-500">{subMessage}</p>
  </div>
);

/* -------------------------------- Main Component -------------------------------- */

export const HospitalListView: React.FC<HospitalListViewProps> = ({
  hospitals,
  favoriteHospitalIds,
  isLoading = false,
  onFavoriteClick,
  onBookClick,
  onViewDetails,
  variant = 'default',
  emptyMessage = 'No hospitals found',
  emptySubMessage = 'Try adjusting your filters or search criteria.',
}) => {
  /* ---------------- Loading State ---------------- */
  if (isLoading) {
    return <SkeletonLoader />;
  }

  /* ---------------- Empty State ---------------- */
  if (!hospitals || hospitals.length === 0) {
    return (
      <EmptyState
        message={emptyMessage}
        subMessage={emptySubMessage}
      />
    );
  }

  /* ---------------- List View ---------------- */
  return (
    <div className="space-y-4">
      {hospitals.map((hospital) => (
        <HospitalCard
          key={hospital.id}
          hospital={hospital}
          isFavorite={favoriteHospitalIds?.has(hospital.id) ?? false}
          onFavoriteClick={onFavoriteClick}
          onBookClick={onBookClick}
          onViewDetails={onViewDetails}
          variant={variant}
        />
      ))}
    </div>
  );
};

export default HospitalListView;