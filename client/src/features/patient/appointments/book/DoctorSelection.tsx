// client/src/features/patient/appointments/book/DoctorSelection.tsx

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Search, Star, User, ChevronRight, Sparkles, Shield, X, Filter, MapPin, Award, Clock } from 'lucide-react';
import type { Doctor } from './BookAppointmentScreen';

// Mock doctors data
const MOCK_DOCTORS: Doctor[] = [
  {
    id: 'doc-001',
    name: 'Dr. Sarah Johnson',
    specialization: 'Cardiologist',
    hospitalId: 'hos-001',
    hospitalName: 'MediCare Super Speciality Hospital',
    hospitalAddress: '123 Healthcare Ave, Andheri East, Mumbai - 400069',
    consultationFee: 1500,
    rating: 4.9,
    totalReviews: 128,
    experience: 12,
    isAvailableToday: true,
  },
  {
    id: 'doc-002',
    name: 'Dr. Michael Chen',
    specialization: 'Neurologist',
    hospitalId: 'hos-001',
    hospitalName: 'MediCare Super Speciality Hospital',
    hospitalAddress: '123 Healthcare Ave, Andheri East, Mumbai - 400069',
    consultationFee: 2000,
    rating: 4.8,
    totalReviews: 95,
    experience: 15,
    isAvailableToday: true,
  },
  {
    id: 'doc-003',
    name: 'Dr. Emily Rodriguez',
    specialization: 'Dermatologist',
    hospitalId: 'hos-002',
    hospitalName: 'Skin Care Clinic',
    hospitalAddress: '45 Beauty Street, Bandra West, Mumbai - 400050',
    consultationFee: 1200,
    rating: 4.9,
    totalReviews: 210,
    experience: 8,
    isAvailableToday: false,
  },
  {
    id: 'doc-004',
    name: 'Dr. James Wilson',
    specialization: 'Orthopedic Surgeon',
    hospitalId: 'hos-001',
    hospitalName: 'MediCare Super Speciality Hospital',
    hospitalAddress: '123 Healthcare Ave, Andheri East, Mumbai - 400069',
    consultationFee: 2500,
    rating: 4.7,
    totalReviews: 156,
    experience: 18,
    isAvailableToday: true,
  },
  {
    id: 'doc-005',
    name: 'Dr. Priya Sharma',
    specialization: 'Pediatrician',
    hospitalId: 'hos-003',
    hospitalName: "Children's Health Center",
    hospitalAddress: '78 Child Care Road, Koregaon Park, Pune - 411001',
    consultationFee: 1000,
    rating: 4.9,
    totalReviews: 178,
    experience: 10,
    isAvailableToday: true,
  },
  {
    id: 'doc-006',
    name: 'Dr. Anita Desai',
    specialization: 'Gynecologist',
    hospitalId: 'hos-004',
    hospitalName: 'Women Care Hospital',
    hospitalAddress: '12 Women Health Ave, Ahmedabad - 380001',
    consultationFee: 1800,
    rating: 4.9,
    totalReviews: 198,
    experience: 14,
    isAvailableToday: true,
  },
  {
    id: 'doc-007',
    name: 'Dr. Vikram Reddy',
    specialization: 'Ophthalmologist',
    hospitalId: 'hos-005',
    hospitalName: 'Vision Eye Care Center',
    hospitalAddress: '56 Sight Road, Hyderabad - 500001',
    consultationFee: 1300,
    rating: 4.8,
    totalReviews: 145,
    experience: 11,
    isAvailableToday: true,
  },
  {
    id: 'doc-008',
    name: 'Dr. Robert Taylor',
    specialization: 'General Physician',
    hospitalId: 'hos-001',
    hospitalName: 'MediCare Super Speciality Hospital',
    hospitalAddress: '123 Healthcare Ave, Andheri East, Mumbai - 400069',
    consultationFee: 800,
    rating: 4.6,
    totalReviews: 234,
    experience: 20,
    isAvailableToday: false,
  },
];

interface DoctorSelectionProps {
  onSelect: (doctor: Doctor) => void;
  selectedDoctorId?: string;
}

const DoctorSelection: React.FC<DoctorSelectionProps> = ({ onSelect, selectedDoctorId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 3000]);
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);

  const specialties = useMemo(() => {
    return Array.from(new Set(MOCK_DOCTORS.map(d => d.specialization)));
  }, []);

  const filteredDoctors = useMemo(() => {
    let filtered = MOCK_DOCTORS;
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(d =>
        d.name.toLowerCase().includes(searchLower) ||
        d.specialization.toLowerCase().includes(searchLower) ||
        d.hospitalName.toLowerCase().includes(searchLower)
      );
    }
    
    if (selectedSpecialty) {
      filtered = filtered.filter(d => d.specialization === selectedSpecialty);
    }
    
    if (priceRange[0] > 0 || priceRange[1] < 3000) {
      filtered = filtered.filter(d => d.consultationFee >= priceRange[0] && d.consultationFee <= priceRange[1]);
    }
    
    if (showOnlyAvailable) {
      filtered = filtered.filter(d => d.isAvailableToday);
    }
    
    return filtered;
  }, [searchTerm, selectedSpecialty, priceRange, showOnlyAvailable]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedSpecialty('');
    setPriceRange([0, 3000]);
    setShowOnlyAvailable(false);
  };

  const activeFiltersCount = [
    searchTerm,
    selectedSpecialty,
    priceRange[0] > 0 || priceRange[1] < 3000,
    showOnlyAvailable,
  ].filter(Boolean).length;

  return (
    <>
      <style>{`
        .doctor-card {
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .doctor-card:hover:not(:disabled) {
          transform: translateY(-2px);
          border-color: #bfdbfe !important;
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%) !important;
          box-shadow: 0 8px 25px -8px rgba(0,0,0,0.1);
        }
        .search-input:focus {
          border-color: #2563eb !important;
          box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
          outline: none;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .shimmer {
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
      `}</style>

      {/* Demo Mode Badge */}
      <div className="mb-5 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3">
        <Sparkles size={16} className="text-amber-600" />
        <p className="text-xs text-amber-700 flex-1 font-medium">
          Demo Mode: Showing sample doctors. Real data will load from backend.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by doctor name, specialization, or hospital..."
          className="search-input w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none transition-all"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <X size={16} className="text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
          >
            <Filter size={14} />
            Filters
            {activeFiltersCount > 0 && (
              <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </button>
          {activeFiltersCount > 0 && (
            <button
              onClick={handleClearFilters}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear all
            </button>
          )}
        </div>

        {showFilters && (
          <div className="space-y-4 pt-3 border-t border-gray-100">
            {/* Specialty Filter */}
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Specialization</label>
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full mt-1 p-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Specializations</option>
                {specialties.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Fee Range (₹)</label>
              <div className="flex gap-3 mt-2">
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                  placeholder="Min"
                  className="w-1/2 p-2 border border-gray-200 rounded-lg text-sm"
                />
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  placeholder="Max"
                  className="w-1/2 p-2 border border-gray-200 rounded-lg text-sm"
                />
              </div>
            </div>

            {/* Available Today */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showOnlyAvailable}
                onChange={(e) => setShowOnlyAvailable(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Available Today Only</span>
            </label>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-sm text-gray-500">
          {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Doctor List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-28 shimmer rounded-xl" />
          ))}
        </div>
      ) : filteredDoctors.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <User size={48} className="mx-auto text-gray-300 mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No doctors found</h3>
          <p className="text-sm text-gray-500">Try adjusting your filters or search terms</p>
          <button
            onClick={handleClearFilters}
            className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
          {filteredDoctors.map((doctor, idx) => {
            const isSelected = selectedDoctorId === doctor.id;
            const isAvailable = doctor.isAvailableToday;

            return (
              <button
                key={doctor.id}
                onClick={() => isAvailable && onSelect(doctor)}
                disabled={!isAvailable}
                className={`doctor-card w-full text-left bg-white rounded-xl border p-4 transition-all ${
                  isSelected ? 'border-blue-400 bg-blue-50/30' : 'border-gray-100'
                } ${!isAvailable ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="flex gap-4">
                  {/* Avatar */}
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-md">
                    {doctor.name.charAt(0)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-900">{doctor.name}</h3>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full">
                          <Shield size={10} />
                          Verified
                        </span>
                      </div>
                      {!isAvailable && (
                        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">
                          Not Available Today
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 mb-1">{doctor.specialization}</p>

                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-2 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Award size={12} />
                        {doctor.experience} years
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={12} />
                        {doctor.hospitalName}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-0.5">
                          <Star size={14} className="fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-semibold text-gray-900">{doctor.rating}</span>
                        </div>
                        <span className="text-xs text-gray-500">({doctor.totalReviews} reviews)</span>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Consultation Fee</p>
                        <p className="text-lg font-bold text-gray-900">₹{doctor.consultationFee}</p>
                      </div>
                    </div>
                  </div>

                  <ChevronRight size={18} className={`flex-shrink-0 mt-5 ${isSelected ? 'text-blue-600' : 'text-gray-300'}`} />
                </div>
              </button>
            );
          })}
        </div>
      )}
    </>
  );
};

export { DoctorSelection };
export default DoctorSelection;