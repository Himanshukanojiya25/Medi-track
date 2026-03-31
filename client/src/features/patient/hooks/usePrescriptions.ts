// client/src/features/patient/hooks/usePrescriptions.ts

import { useState, useEffect, useCallback } from 'react';

// ============================================================================
// TYPES
// ============================================================================

export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  hospitalId?: string;
  hospitalName?: string;
  medications: Medication[];
  diagnosis?: string;
  notes?: string;
  prescribedAt: string;
  validUntil: string;
  status: 'active' | 'expired' | 'cancelled' | 'completed';
  refillsRemaining: number;
  totalRefills: number;
  isChronic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
  isActive: boolean;
}

export interface PrescriptionFilters {
  status?: Prescription['status'] | Prescription['status'][];
  doctorId?: string;
  hospitalId?: string;
  fromDate?: string;
  toDate?: string;
  search?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

interface UsePrescriptionsReturn {
  prescriptions: Prescription[];
  activePrescriptions: Prescription[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  filters: PrescriptionFilters;
  hasMore: boolean;
  total: number;
  setFilters: (filters: PrescriptionFilters | ((prev: PrescriptionFilters) => PrescriptionFilters)) => void;
  downloadPrescription: (id: string) => Promise<Blob>;
  refetch: () => Promise<void>;
  loadMore: () => Promise<void>;
  clearError: () => void;
  resetFilters: () => void;
}

// ============================================================================
// MOCK DATA (Replace with actual API calls)
// ============================================================================

const mockPrescriptions: Prescription[] = [
  {
    id: 'pres_1',
    patientId: 'patient_001',
    doctorId: 'doc_001',
    doctorName: 'Dr. Sarah Johnson',
    doctorSpecialty: 'Cardiology',
    hospitalName: 'City Hospital',
    medications: [
      {
        id: 'med_1',
        name: 'Lisinopril',
        dosage: '10mg',
        frequency: 'Once daily',
        duration: '30 days',
        instructions: 'Take with food',
        isActive: true,
      },
    ],
    diagnosis: 'Hypertension',
    prescribedAt: new Date().toISOString(),
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    refillsRemaining: 2,
    totalRefills: 3,
    isChronic: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const prescriptionsService = {
  getPrescriptions: async (
    filters?: PrescriptionFilters,
    page: number = 1,
    limit: number = 10
  ): Promise<{ data: Prescription[]; total: number; totalPages: number }> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filtered = [...mockPrescriptions];
    
    if (filters?.status) {
      const statuses = Array.isArray(filters.status) ? filters.status : [filters.status];
      filtered = filtered.filter(p => statuses.includes(p.status));
    }
    
    if (filters?.doctorId) {
      filtered = filtered.filter(p => p.doctorId === filters.doctorId);
    }
    
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(p => 
        p.doctorName.toLowerCase().includes(searchLower) ||
        p.diagnosis?.toLowerCase().includes(searchLower)
      );
    }
    
    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);
    
    return {
      data: paginated,
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / limit),
    };
  },
  
  downloadPrescription: async (id: string): Promise<Blob> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return new Blob(['PDF Content'], { type: 'application/pdf' });
  },
};

// ============================================================================
// HOOK IMPLEMENTATION
// ============================================================================

export const usePrescriptions = (initialFilters?: PrescriptionFilters): UsePrescriptionsReturn => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] = useState<PrescriptionFilters>(initialFilters || {});
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  const clearError = useCallback(() => setError(null), []);
  const resetFilters = useCallback(() => {
    setFiltersState({});
    setCurrentPage(1);
  }, []);

  const fetchPrescriptions = useCallback(async (page: number = 1, append: boolean = false): Promise<void> => {
    const setLoading = page === 1 ? setIsLoading : setIsLoadingMore;
    setLoading(true);
    setError(null);
    
    try {
      const response = await prescriptionsService.getPrescriptions(filters, page, 10);
      
      if (append) {
        setPrescriptions(prev => [...prev, ...response.data]);
      } else {
        setPrescriptions(response.data);
      }
      
      setTotal(response.total);
      setTotalPages(response.totalPages);
      setCurrentPage(page);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch prescriptions';
      setError(errorMessage);
      console.error('[usePrescriptions] Error:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const setFilters = useCallback((
    newFilters: PrescriptionFilters | ((prev: PrescriptionFilters) => PrescriptionFilters)
  ): void => {
    setFiltersState(prev => {
      const updated = typeof newFilters === 'function' ? newFilters(prev) : newFilters;
      setCurrentPage(1);
      return updated;
    });
  }, []);

  const downloadPrescription = useCallback(async (id: string): Promise<Blob> => {
    try {
      const blob = await prescriptionsService.downloadPrescription(id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `prescription_${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      return blob;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to download prescription';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const loadMore = useCallback(async (): Promise<void> => {
    if (currentPage < totalPages && !isLoadingMore) {
      await fetchPrescriptions(currentPage + 1, true);
    }
  }, [currentPage, totalPages, isLoadingMore, fetchPrescriptions]);

  const refetch = useCallback(async (): Promise<void> => {
    await fetchPrescriptions(1, false);
  }, [fetchPrescriptions]);

  useEffect(() => {
    fetchPrescriptions(1, false);
  }, [filters, fetchPrescriptions]);

  const activePrescriptions = prescriptions.filter(p => p.status === 'active');
  const hasMore = currentPage < totalPages;

  return {
    prescriptions,
    activePrescriptions,
    isLoading,
    isLoadingMore,
    error,
    filters,
    hasMore,
    total,
    setFilters,
    downloadPrescription,
    refetch,
    loadMore,
    clearError,
    resetFilters,
  };
};

export default usePrescriptions;