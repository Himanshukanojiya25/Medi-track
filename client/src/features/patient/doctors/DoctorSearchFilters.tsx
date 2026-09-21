// client/src/features/patient/doctors/DoctorSearchFilters.tsx
import React from 'react';
import { X, Filter } from 'lucide-react';
import { DoctorSpeciality, getSpecialityDisplay } from '../../../types/patient/doctor.types';

export interface DoctorFilterState {
  specialization: string;
  minExperience: number;
  maxFee: number;
  minRating: number;
  availableToday: boolean;
}

export interface DoctorSearchFiltersProps {
  filters: DoctorFilterState;
  onFilterChange: (filters: DoctorFilterState) => void;
  onClearAll: () => void;
  totalResults?: number;
  className?: string;
}

const experienceOptions = [0, 3, 5, 10, 15, 20];
const feeOptions = [500, 1000, 1500, 2000, 2500, 5000];
const ratingOptions = [0, 3, 3.5, 4, 4.5];

export const DoctorSearchFilters: React.FC<DoctorSearchFiltersProps> = ({
  filters,
  onFilterChange,
  onClearAll,
  totalResults,
  className = '',
}) => {
  const updateFilter = <K extends keyof DoctorFilterState>(key: K, value: DoctorFilterState[K]) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const activeFiltersCount = [
    filters.specialization,
    filters.minExperience > 0,
    filters.maxFee < 5000,
    filters.minRating > 0,
    filters.availableToday,
  ].filter(Boolean).length;

  return (
    <div className={`bg-white rounded-xl border border-gray-100 p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-gray-500" />
          <h3 className="font-semibold text-gray-900">Filters</h3>
          {activeFiltersCount > 0 && (
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <button
            onClick={onClearAll}
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <X size={14} />
            Clear all
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Specialization */}
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Specialization</label>
          <select
            value={filters.specialization}
            onChange={(e) => updateFilter('specialization', e.target.value)}
            className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All</option>
            {Object.values(DoctorSpeciality).map((spec) => (
              <option key={spec} value={spec}>{getSpecialityDisplay(spec)}</option>
            ))}
          </select>
        </div>

        {/* Min Experience */}
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Min Experience</label>
          <select
            value={filters.minExperience}
            onChange={(e) => updateFilter('minExperience', Number(e.target.value))}
            className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {experienceOptions.map((exp) => (
              <option key={exp} value={exp}>{exp === 0 ? 'Any' : `${exp}+ years`}</option>
            ))}
          </select>
        </div>

        {/* Max Fee */}
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Max Fee (₹)</label>
          <select
            value={filters.maxFee}
            onChange={(e) => updateFilter('maxFee', Number(e.target.value))}
            className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {feeOptions.map((fee) => (
              <option key={fee} value={fee}>{fee === 5000 ? 'Any' : `₹${fee}+`}</option>
            ))}
          </select>
        </div>

        {/* Min Rating */}
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Min Rating</label>
          <select
            value={filters.minRating}
            onChange={(e) => updateFilter('minRating', Number(e.target.value))}
            className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {ratingOptions.map((rating) => (
              <option key={rating} value={rating}>{rating === 0 ? 'Any' : `${rating}+ ⭐`}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Available Today */}
      <div className="mt-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.availableToday}
            onChange={(e) => updateFilter('availableToday', e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">Available Today</span>
        </label>
      </div>

      {totalResults !== undefined && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-500">{totalResults} doctors found</p>
        </div>
      )}
    </div>
  );
};