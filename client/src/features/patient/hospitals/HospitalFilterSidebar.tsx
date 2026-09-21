// client/src/features/patient/hospitals/HospitalFilterSidebar.tsx

import React, { useState, useEffect } from 'react';
import { X, SlidersHorizontal, Star, Building2, Ambulance } from 'lucide-react';
import { cities, specialities } from './mockData';
import type { HospitalFilterState } from './HospitalSearchFilters';

interface HospitalFilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  filters: HospitalFilterState;
  onFilterChange: (filters: HospitalFilterState) => void;
  onApply: () => void;
  onReset: () => void;
}

const ratingOptions = [0, 3, 3.5, 4, 4.5];

export const HospitalFilterSidebar: React.FC<HospitalFilterSidebarProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onApply,
  onReset,
}) => {
  const [localFilters, setLocalFilters] = useState<HospitalFilterState>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const updateFilter = <K extends keyof HospitalFilterState>(key: K, value: HospitalFilterState[K]) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    onFilterChange(localFilters);
    onApply();
  };

  const handleReset = () => {
    const resetFilters: HospitalFilterState = {
      city: '',
      speciality: '',
      minRating: 0,
      emergencyServices: false,
    };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
    onReset();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose} />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-white shadow-xl z-50 flex flex-col animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={20} />
            <h2 className="text-lg font-semibold">Filters</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* City Filter */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">City</label>
            <select
              value={localFilters.city}
              onChange={(e) => updateFilter('city', e.target.value)}
              className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            >
              <option value="">All Cities</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* Specialty Filter */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Specialty</label>
            <select
              value={localFilters.speciality}
              onChange={(e) => updateFilter('speciality', e.target.value)}
              className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            >
              <option value="">All Specialties</option>
              {specialities.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>

          {/* Rating Filter */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Minimum Rating</label>
            <select
              value={localFilters.minRating}
              onChange={(e) => updateFilter('minRating', Number(e.target.value))}
              className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            >
              {ratingOptions.map(rating => (
                <option key={rating} value={rating}>{rating === 0 ? 'Any Rating' : `${rating}+ stars`}</option>
              ))}
            </select>
          </div>

          {/* Emergency Services */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={localFilters.emergencyServices}
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

        {/* Footer */}
        <div className="p-4 border-t flex gap-3">
          <button
            onClick={handleReset}
            className="flex-1 py-2 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Reset
          </button>
          <button
            onClick={handleApply}
            className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </>
  );
};

export default HospitalFilterSidebar;