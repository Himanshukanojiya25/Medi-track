// client/src/features/patient/hospitals/HospitalSearchFilters.tsx

import React from 'react';
import { X, Filter, Star, Building2, Ambulance } from 'lucide-react';
import { cities, specialities } from './mockData';

export interface HospitalFilterState {
  city: string;
  speciality: string;
  minRating: number;
  emergencyServices: boolean;
}

interface HospitalSearchFiltersProps {
  filters: HospitalFilterState;
  onFilterChange: (filters: HospitalFilterState) => void;
  onClearAll: () => void;
  totalResults?: number;
  className?: string;
}

const ratingOptions = [0, 3, 3.5, 4, 4.5];

export const HospitalSearchFilters: React.FC<HospitalSearchFiltersProps> = ({
  filters,
  onFilterChange,
  onClearAll,
  totalResults,
  className = '',
}) => {
  const updateFilter = <K extends keyof HospitalFilterState>(key: K, value: HospitalFilterState[K]) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const activeFiltersCount = [
    filters.city,
    filters.speciality,
    filters.minRating > 0,
    filters.emergencyServices,
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
          <button onClick={onClearAll} className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
            <X size={14} /> Clear all
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* City Filter */}
        <div>
          <label className="text-xs text-gray-500 mb-1 block">City</label>
          <select
            value={filters.city}
            onChange={(e) => updateFilter('city', e.target.value)}
            className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          >
            <option value="">All Cities</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        {/* Specialty Filter */}
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Specialty</label>
          <select
            value={filters.speciality}
            onChange={(e) => updateFilter('speciality', e.target.value)}
            className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          >
            <option value="">All Specialties</option>
            {specialities.map(spec => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>
        </div>

        {/* Rating Filter */}
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Min Rating</label>
          <select
            value={filters.minRating}
            onChange={(e) => updateFilter('minRating', Number(e.target.value))}
            className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          >
            {ratingOptions.map(rating => (
              <option key={rating} value={rating}>{rating === 0 ? 'Any Rating' : `${rating}+ ⭐`}</option>
            ))}
          </select>
        </div>

        {/* Emergency Services */}
        <div className="flex items-center pt-5">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.emergencyServices}
              onChange={(e) => updateFilter('emergencyServices', e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 flex items-center gap-1">
              <Ambulance size={14} />
              24/7 Emergency Available
            </span>
          </label>
        </div>
      </div>

      {totalResults !== undefined && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-500">{totalResults} hospitals found</p>
        </div>
      )}
    </div>
  );
};

export default HospitalSearchFilters;