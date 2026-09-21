// client/src/features/patient/doctors/DoctorListView.tsx
import React from 'react';
import { DoctorCard } from './DoctorCard';
import type { Doctor } from '../../../types/patient/doctor.types';

export interface DoctorListViewProps {
  doctors: Doctor[];
  favoriteDoctorIds: Set<string>;
  isLoading?: boolean;
  onFavoriteClick?: (doctorId: string) => void;
  onBookClick?: (doctorId: string) => void;
  onViewDetails?: (doctorId: string) => void;
  variant?: 'default' | 'compact';
  emptyMessage?: string;
  emptySubMessage?: string;
}

export const DoctorListView: React.FC<DoctorListViewProps> = ({
  doctors,
  favoriteDoctorIds,
  isLoading = false,
  onFavoriteClick,
  onBookClick,
  onViewDetails,
  variant = 'default',
  emptyMessage = 'No doctors found',
  emptySubMessage = 'Try adjusting your filters or search criteria.',
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse">
            <div className="flex gap-4">
              <div className="w-20 h-20 rounded-full bg-gray-200" />
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
  }

  if (doctors.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{emptyMessage}</h3>
        <p className="text-gray-500">{emptySubMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {doctors.map((doctor) => (
        <DoctorCard
          key={doctor.id}
          doctor={doctor}
          isFavorite={favoriteDoctorIds.has(doctor.id)}
          onFavoriteClick={onFavoriteClick}
          onBookClick={onBookClick}
          onViewDetails={onViewDetails}
          variant={variant}
        />
      ))}
    </div>
  );
};