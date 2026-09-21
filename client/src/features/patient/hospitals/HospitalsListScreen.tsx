// client/src/features/patient/hospitals/HospitalsListScreen.tsx

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Filter, MapPin, Star, Building2, Ambulance } from 'lucide-react';
import { HospitalListView } from './HospitalListView';
import { HospitalSearchBar } from './HospitalSearchBar';
import { HospitalSearchFilters, HospitalFilterState } from './HospitalSearchFilters';
import { HospitalFilterSidebar } from './HospitalFilterSidebar';
import { MOCK_HOSPITALS, filterMockHospitals } from './mockData';
import type { Hospital } from '../../../types/patient/hospital.types';

const defaultFilters: HospitalFilterState = {
  city: '',
  speciality: '',
  minRating: 0,
  emergencyServices: false,
};

export const HospitalsListScreen: React.FC = () => {
  const navigate = useNavigate();
  
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [filteredHospitals, setFilteredHospitals] = useState<Hospital[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [useMockData, setUseMockData] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<HospitalFilterState>(defaultFilters);
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);

  // Load hospitals
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setHospitals(MOCK_HOSPITALS);
      setUseMockData(true);
      setIsLoading(false);
    }, 500);
  }, []);

  // Apply filters
  useEffect(() => {
    const filtered = filterMockHospitals(hospitals, searchTerm, filters);
    setFilteredHospitals(filtered);
  }, [hospitals, searchTerm, filters]);

  const handleFavoriteToggle = (hospitalId: string) => {
    setFavoriteIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(hospitalId)) {
        newSet.delete(hospitalId);
      } else {
        newSet.add(hospitalId);
      }
      return newSet;
    });
  };

  const handleBookClick = (hospitalId: string) => {
    navigate(`/patient/appointments/book?hospitalId=${hospitalId}`);
  };

  const handleViewDetails = (hospitalId: string) => {
    navigate(`/patient/hospitals/${hospitalId}`);
  };

  const handleClearFilters = () => {
    setFilters(defaultFilters);
    setSearchTerm('');
  };

  const activeFiltersCount = [
    filters.city,
    filters.speciality,
    filters.minRating > 0,
    filters.emergencyServices,
  ].filter(Boolean).length;

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hospitals-list-wrap { animation: fadeIn 0.3s ease; }
      `}</style>

      <div className="hospitals-list-wrap min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-6">
          
          {/* Mock Data Banner */}
          {useMockData && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3">
              <Shield size={18} className="text-amber-600" />
              <p className="text-sm text-amber-700 flex-1">
                Demo Mode: Showing sample hospitals. Backend API integration coming soon.
              </p>
            </div>
          )}

          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Find Hospitals</h1>
              <p className="text-sm text-gray-500">Discover top healthcare facilities near you</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-4">
            <HospitalSearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search by hospital name, city, or specialty..."
            />
          </div>

          {/* Filters - Desktop */}
          <div className="hidden md:block mb-4">
            <HospitalSearchFilters
              filters={filters}
              onFilterChange={setFilters}
              onClearAll={handleClearFilters}
              totalResults={filteredHospitals.length}
            />
          </div>

          {/* Filters - Mobile Button */}
          <div className="md:hidden mb-4">
            <button
              onClick={() => setIsFilterSidebarOpen(true)}
              className="w-full py-2.5 bg-white border border-gray-200 rounded-xl flex items-center justify-center gap-2 text-gray-700 font-medium"
            >
              <Filter size={18} />
              Filters
              {activeFiltersCount > 0 && (
                <span className="w-2 h-2 bg-blue-600 rounded-full" />
              )}
            </button>
          </div>

          {/* Results Count */}
          <div className="mb-4">
            <p className="text-sm text-gray-500">
              {filteredHospitals.length} hospital{filteredHospitals.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {/* Hospital List */}
          <HospitalListView
            hospitals={filteredHospitals}
            favoriteHospitalIds={favoriteIds}
            isLoading={isLoading}
            onFavoriteClick={handleFavoriteToggle}
            onBookClick={handleBookClick}
            onViewDetails={handleViewDetails}
            emptyMessage="No hospitals found"
            emptySubMessage="Try adjusting your filters or search criteria"
          />
        </div>
      </div>

      {/* Mobile Filter Sidebar */}
      <HospitalFilterSidebar
        isOpen={isFilterSidebarOpen}
        onClose={() => setIsFilterSidebarOpen(false)}
        filters={filters}
        onFilterChange={setFilters}
        onApply={() => setIsFilterSidebarOpen(false)}
        onReset={handleClearFilters}
      />
    </>
  );
};

export default HospitalsListScreen;