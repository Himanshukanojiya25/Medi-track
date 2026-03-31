// client/src/features/patient/hooks/useFavorites.ts

import { useState, useEffect, useCallback } from 'react';

// ============================================================================
// TYPES
// ============================================================================

export interface FavoriteDoctor {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  hospitalName?: string;
  rating?: number;
  experience?: number;
  avatar?: string;
  addedAt: string;
}

export interface FavoriteHospital {
  id: string;
  hospitalId: string;
  hospitalName: string;
  address: string;
  rating?: number;
  distance?: number;
  addedAt: string;
}

export interface FavoriteFilters {
  type?: 'doctor' | 'hospital';
  search?: string;
  specialty?: string;
  sortBy?: 'addedAt' | 'name' | 'rating';
  sortOrder?: 'asc' | 'desc';
}

interface UseFavoritesReturn {
  favoriteDoctors: FavoriteDoctor[];
  favoriteHospitals: FavoriteHospital[];
  isLoading: boolean;
  isAdding: boolean;
  isRemoving: boolean;
  error: string | null;
  filters: FavoriteFilters;
  setFilters: (filters: FavoriteFilters | ((prev: FavoriteFilters) => FavoriteFilters)) => void;
  addFavoriteDoctor: (doctorId: string) => Promise<void>;
  addFavoriteHospital: (hospitalId: string) => Promise<void>;
  removeFavoriteDoctor: (doctorId: string) => Promise<void>;
  removeFavoriteHospital: (hospitalId: string) => Promise<void>;
  isDoctorFavorite: (doctorId: string) => boolean;
  isHospitalFavorite: (hospitalId: string) => boolean;
  refetch: () => Promise<void>;
  clearError: () => void;
  resetFilters: () => void;
}

// ============================================================================
// MOCK DATA (Replace with actual API calls)
// ============================================================================

const mockFavoriteDoctors: FavoriteDoctor[] = [
  {
    id: 'fav_1',
    doctorId: 'doc_001',
    doctorName: 'Dr. Sarah Johnson',
    specialty: 'Cardiology',
    hospitalName: 'City Hospital',
    rating: 4.8,
    experience: 12,
    addedAt: new Date().toISOString(),
  },
  {
    id: 'fav_2',
    doctorId: 'doc_002',
    doctorName: 'Dr. Michael Chen',
    specialty: 'Dermatology',
    hospitalName: 'City Hospital',
    rating: 4.9,
    experience: 8,
    addedAt: new Date().toISOString(),
  },
];

const mockFavoriteHospitals: FavoriteHospital[] = [
  {
    id: 'fav_h_1',
    hospitalId: 'hospital_001',
    hospitalName: 'City Hospital',
    address: '123 Main St, Cityville',
    rating: 4.7,
    distance: 2.5,
    addedAt: new Date().toISOString(),
  },
];

const favoritesService = {
  getFavorites: async (filters?: FavoriteFilters): Promise<{ doctors: FavoriteDoctor[]; hospitals: FavoriteHospital[] }> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let doctors = [...mockFavoriteDoctors];
    let hospitals = [...mockFavoriteHospitals];
    
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      doctors = doctors.filter(d => 
        d.doctorName.toLowerCase().includes(searchLower) ||
        d.specialty.toLowerCase().includes(searchLower)
      );
      hospitals = hospitals.filter(h => 
        h.hospitalName.toLowerCase().includes(searchLower)
      );
    }
    
    if (filters?.specialty) {
      doctors = doctors.filter(d => d.specialty === filters.specialty);
    }
    
    return { doctors, hospitals };
  },
  
  addFavoriteDoctor: async (doctorId: string): Promise<FavoriteDoctor> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: `fav_${Date.now()}`,
      doctorId,
      doctorName: 'New Doctor',
      specialty: 'General',
      addedAt: new Date().toISOString(),
    };
  },
  
  addFavoriteHospital: async (hospitalId: string): Promise<FavoriteHospital> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: `fav_h_${Date.now()}`,
      hospitalId,
      hospitalName: 'New Hospital',
      address: 'Unknown',
      addedAt: new Date().toISOString(),
    };
  },
  
  removeFavoriteDoctor: async (doctorId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
  },
  
  removeFavoriteHospital: async (hospitalId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
  },
};

// ============================================================================
// HOOK IMPLEMENTATION
// ============================================================================

export const useFavorites = (initialFilters?: FavoriteFilters): UseFavoritesReturn => {
  const [favoriteDoctors, setFavoriteDoctors] = useState<FavoriteDoctor[]>([]);
  const [favoriteHospitals, setFavoriteHospitals] = useState<FavoriteHospital[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [isRemoving, setIsRemoving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] = useState<FavoriteFilters>(initialFilters || {});

  const clearError = useCallback(() => setError(null), []);
  const resetFilters = useCallback(() => setFiltersState({}), []);

  const fetchFavorites = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { doctors, hospitals } = await favoritesService.getFavorites(filters);
      setFavoriteDoctors(doctors);
      setFavoriteHospitals(hospitals);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch favorites';
      setError(errorMessage);
      console.error('[useFavorites] Error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const setFilters = useCallback((
    newFilters: FavoriteFilters | ((prev: FavoriteFilters) => FavoriteFilters)
  ): void => {
    setFiltersState(prev => {
      const updated = typeof newFilters === 'function' ? newFilters(prev) : newFilters;
      return updated;
    });
  }, []);

  const addFavoriteDoctor = useCallback(async (doctorId: string): Promise<void> => {
    setIsAdding(true);
    setError(null);
    
    try {
      const newFavorite = await favoritesService.addFavoriteDoctor(doctorId);
      setFavoriteDoctors(prev => [newFavorite, ...prev]);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to add favorite doctor';
      setError(errorMessage);
      throw err;
    } finally {
      setIsAdding(false);
    }
  }, []);

  const addFavoriteHospital = useCallback(async (hospitalId: string): Promise<void> => {
    setIsAdding(true);
    setError(null);
    
    try {
      const newFavorite = await favoritesService.addFavoriteHospital(hospitalId);
      setFavoriteHospitals(prev => [newFavorite, ...prev]);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to add favorite hospital';
      setError(errorMessage);
      throw err;
    } finally {
      setIsAdding(false);
    }
  }, []);

  const removeFavoriteDoctor = useCallback(async (doctorId: string): Promise<void> => {
    setIsRemoving(true);
    setError(null);
    
    try {
      await favoritesService.removeFavoriteDoctor(doctorId);
      setFavoriteDoctors(prev => prev.filter(d => d.doctorId !== doctorId));
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to remove favorite doctor';
      setError(errorMessage);
      throw err;
    } finally {
      setIsRemoving(false);
    }
  }, []);

  const removeFavoriteHospital = useCallback(async (hospitalId: string): Promise<void> => {
    setIsRemoving(true);
    setError(null);
    
    try {
      await favoritesService.removeFavoriteHospital(hospitalId);
      setFavoriteHospitals(prev => prev.filter(h => h.hospitalId !== hospitalId));
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to remove favorite hospital';
      setError(errorMessage);
      throw err;
    } finally {
      setIsRemoving(false);
    }
  }, []);

  const isDoctorFavorite = useCallback((doctorId: string): boolean => {
    return favoriteDoctors.some(d => d.doctorId === doctorId);
  }, [favoriteDoctors]);

  const isHospitalFavorite = useCallback((hospitalId: string): boolean => {
    return favoriteHospitals.some(h => h.hospitalId === hospitalId);
  }, [favoriteHospitals]);

  useEffect(() => {
    fetchFavorites();
  }, [filters, fetchFavorites]);

  return {
    favoriteDoctors,
    favoriteHospitals,
    isLoading,
    isAdding,
    isRemoving,
    error,
    filters,
    setFilters,
    addFavoriteDoctor,
    addFavoriteHospital,
    removeFavoriteDoctor,
    removeFavoriteHospital,
    isDoctorFavorite,
    isHospitalFavorite,
    refetch: fetchFavorites,
    clearError,
    resetFilters,
  };
};

export default useFavorites;