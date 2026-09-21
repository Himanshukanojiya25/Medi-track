// client/src/features/patient/doctors/DoctorFilterSidebar.tsx
import React from 'react';
import { X, SlidersHorizontal } from 'lucide-react';
import { DoctorSpeciality, getSpecialityDisplay } from '../../../types/patient/doctor.types';
import type { DoctorFilterState } from './DoctorSearchFilters';

export interface DoctorFilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  filters: DoctorFilterState;
  onFilterChange: (filters: DoctorFilterState) => void;
  onApply: () => void;
  onReset: () => void;
}

const experienceOptions = [0, 3, 5, 10, 15, 20];
const feeOptions = [500, 1000, 1500, 2000, 2500, 3000, 4000, 5000];
const ratingOptions = [0, 3, 3.5, 4, 4.5];

export const DoctorFilterSidebar: React.FC<DoctorFilterSidebarProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onApply,
  onReset,
}) => {
  const [localFilters, setLocalFilters] = React.useState<DoctorFilterState>(filters);

  React.useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const updateFilter = <K extends keyof DoctorFilterState>(key: K, value: DoctorFilterState[K]) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    onFilterChange(localFilters);
    onApply();
  };

  const handleReset = () => {
    const resetFilters: DoctorFilterState = {
      specialization: '',
      minExperience: 0,
      maxFee: 5000,
      minRating: 0,
      availableToday: false,
    };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
    onReset();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-white shadow-xl z-50 flex flex-col animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={20} />
            <h2 className="text-lg font-semibold">Filters</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Specialization */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Specialization</label>
            <select
              value={localFilters.specialization}
              onChange={(e) => updateFilter('specialization', e.target.value)}
              className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Specializations</option>
              {Object.values(DoctorSpeciality).map((spec) => (
                <option key={spec} value={spec}>{getSpecialityDisplay(spec)}</option>
              ))}
            </select>
          </div>

          {/* Experience */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Experience</label>
            <select
              value={localFilters.minExperience}
              onChange={(e) => updateFilter('minExperience', Number(e.target.value))}
              className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {experienceOptions.map((exp) => (
                <option key={exp} value={exp}>{exp === 0 ? 'Any' : `${exp}+ years`}</option>
              ))}
            </select>
          </div>

          {/* Fee Range */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Max Consultation Fee</label>
            <select
              value={localFilters.maxFee}
              onChange={(e) => updateFilter('maxFee', Number(e.target.value))}
              className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {feeOptions.map((fee) => (
                <option key={fee} value={fee}>₹{fee}{fee === 5000 ? '+' : ''}</option>
              ))}
            </select>
          </div>

          {/* Rating */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Minimum Rating</label>
            <select
              value={localFilters.minRating}
              onChange={(e) => updateFilter('minRating', Number(e.target.value))}
              className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {ratingOptions.map((rating) => (
                <option key={rating} value={rating}>{rating === 0 ? 'Any' : `${rating}+ stars`}</option>
              ))}
            </select>
          </div>

          {/* Available Today */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={localFilters.availableToday}
                onChange={(e) => updateFilter('availableToday', e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Available Today</span>
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