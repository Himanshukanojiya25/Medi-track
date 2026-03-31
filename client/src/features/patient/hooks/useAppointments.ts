// client/src/features/patient/hooks/useAppointments.ts

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type { 
  Appointment, 
  AppointmentStatus, 
  AppointmentType,
  AppointmentPriority,
  AppointmentFilters,
  AppointmentStatistics,
  AppointmentPaymentStatus
} from '../../../types/appointment/appointment.types';
import type { PatientStatistics, LoyaltyTier } from '../../../types/patient/patient.types';

// ============================================================================
// TYPES
// ============================================================================

export interface UseAppointmentsOptions {
  initialFilters?: AppointmentFilters;
  autoFetch?: boolean;
  cacheTime?: number;
  retryCount?: number;
  retryDelay?: number;
}

export interface UseAppointmentsReturn {
  appointments: Appointment[];
  stats: PatientStatistics | null;
  detailedStats: AppointmentStatistics | null;
  isLoading: boolean;
  isFetchingStats: boolean;
  isRefreshing: boolean;
  isLoadingMore: boolean;
  error: string | null;
  validationErrors: Record<string, string>;
  filters: AppointmentFilters;
  setFilters: (filters: AppointmentFilters | ((prev: AppointmentFilters) => AppointmentFilters)) => void;
  resetFilters: () => void;
  hasMore: boolean;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  loadMore: () => Promise<void>;
  refetch: () => Promise<void>;
  refresh: () => Promise<void>;
  refetchStats: () => Promise<void>;
  clearError: () => void;
  invalidateCache: () => void;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const DEFAULT_RETRY_COUNT = 3;
const DEFAULT_RETRY_DELAY = 1000;
const DEFAULT_CACHE_TIME = 5 * 60 * 1000;

// ============================================================================
// MOCK SERVICE (Replace with actual API call)
// ============================================================================

const appointmentService = {
  getAppointments: async (
    filters?: AppointmentFilters,
    page: number = 1,
    limit: number = 10
  ): Promise<{ data: Appointment[]; total: number; totalPages: number }> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockAppointments: Appointment[] = [
      {
        id: '1',
        patientId: 'patient_001',
        doctorId: 'doc_001',
        hospitalId: 'hospital_001',
        status: 'CONFIRMED' as AppointmentStatus,
        scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        durationMinutes: 30,
        reason: 'Regular checkup',
        type: 'IN_PERSON' as AppointmentType,
        priority: 'ROUTINE' as AppointmentPriority,
        isEmergency: false,
        isActive: true,
        isDeleted: false,
        version: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        patient: {
          id: 'patient_001',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890',
        },
        doctor: {
          id: 'doc_001',
          name: 'Dr. Sarah Johnson',
          specialty: 'Cardiology',
          rating: 4.8,
        },
        hospital: {
          id: 'hospital_001',
          name: 'City Hospital',
        },
        location: {
          name: 'City Hospital',
          address: '123 Main St, City',
          room: '204',
        },
        billing: {
          consultationFee: 150,
          additionalFees: 0,
          totalAmount: 150,
          paidAmount: 150,
          dueAmount: 0,
          currency: 'USD',
          paymentStatus: 'PAID' as AppointmentPaymentStatus,
        },
        reminders: {
          reminderHours: [24, 1],
          confirmationSent: true,
          confirmationReceived: true,
        },
      },
      {
        id: '2',
        patientId: 'patient_001',
        doctorId: 'doc_002',
        hospitalId: 'hospital_001',
        status: 'CONFIRMED' as AppointmentStatus,
        scheduledAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        durationMinutes: 20,
        reason: 'Follow-up consultation',
        type: 'VIDEO_CALL' as AppointmentType,
        priority: 'ROUTINE' as AppointmentPriority,
        isEmergency: false,
        isActive: true,
        isDeleted: false,
        version: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        patient: {
          id: 'patient_001',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890',
        },
        doctor: {
          id: 'doc_002',
          name: 'Dr. Michael Chen',
          specialty: 'Dermatology',
          rating: 4.9,
        },
        hospital: {
          id: 'hospital_001',
          name: 'City Hospital',
        },
        location: {
          name: 'Virtual Meeting',
          address: 'Online',
        },
        virtualMeeting: {
          platform: 'zoom',
          meetingId: '123-456-789',
          joinUrl: 'https://zoom.us/j/123456789',
        },
        billing: {
          consultationFee: 100,
          additionalFees: 0,
          totalAmount: 100,
          paidAmount: 100,
          dueAmount: 0,
          currency: 'USD',
          paymentStatus: 'PAID' as AppointmentPaymentStatus,
        },
      },
    ];
    
    // Apply filters
    let filtered = [...mockAppointments];
    
    if (filters?.status) {
      const statuses = Array.isArray(filters.status) ? filters.status : [filters.status];
      filtered = filtered.filter(a => statuses.includes(a.status));
    }
    
    if (filters?.type) {
      const types = Array.isArray(filters.type) ? filters.type : [filters.type];
      filtered = filtered.filter(a => types.includes(a.type));
    }
    
    if (filters?.priority) {
      const priorities = Array.isArray(filters.priority) ? filters.priority : [filters.priority];
      filtered = filtered.filter(a => priorities.includes(a.priority));
    }
    
    if (filters?.doctorId) {
      filtered = filtered.filter(a => a.doctorId === filters.doctorId);
    }
    
    if (filters?.hospitalId) {
      filtered = filtered.filter(a => a.hospitalId === filters.hospitalId);
    }
    
    if (filters?.startDate) {
      filtered = filtered.filter(a => a.scheduledAt >= filters.startDate!);
    }
    
    if (filters?.endDate) {
      filtered = filtered.filter(a => a.scheduledAt <= filters.endDate!);
    }
    
    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);
    
    return {
      data: paginated,
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / limit),
    };
  },
  
  getStats: async (): Promise<PatientStatistics> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      totalAppointments: 24,
      completedAppointments: 18,
      cancelledAppointments: 3,
      upcomingAppointments: 3,
      totalPrescriptions: 12,
      totalReports: 8,
      favoriteDoctors: 4,
      favoriteHospitals: 2,
      lastActive: new Date().toISOString(),
      totalSpent: 1250,
      outstandingBalance: 0,
      loyaltyPoints: 1250,
      loyaltyTier: 'SILVER' as LoyaltyTier,
      noShowRate: 0,
      averageRating: 4.8,
      healthScore: 85,
      thisYearVisits: 12,
      lastYearVisits: 8,
    };
  },
  
  getDetailedStats: async (): Promise<AppointmentStatistics> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Create complete Record objects with all enum values
    const byStatus: Record<AppointmentStatus, number> = {
      PENDING: 0,
      REQUESTED: 0,
      CONFIRMED: 3,
      CHECKED_IN: 0,
      WAITING: 0,
      READY: 0,
      IN_PROGRESS: 0,
      WITH_DOCTOR: 0,
      COMPLETED: 18,
      FOLLOW_UP_NEEDED: 0,
      CANCELLED_BY_PATIENT: 3,
      CANCELLED_BY_DOCTOR: 0,
      CANCELLED_BY_HOSPITAL: 0,
      NO_SHOW_PATIENT: 0,
      NO_SHOW_DOCTOR: 0,
      RESCHEDULED: 0,
      RESCHEDULE_REQUESTED: 0,
      EMERGENCY: 0,
      MISSED: 0,
      EXPIRED: 0,
    };
    
    const byType: Record<AppointmentType, number> = {
      IN_PERSON: 15,
      VIDEO_CALL: 7,
      PHONE_CALL: 2,
      HOME_VISIT: 0,
      EMERGENCY: 0,
      FOLLOW_UP: 0,
      CONSULTATION: 0,
      PROCEDURE: 0,
      SURGERY: 0,
      VACCINATION: 0,
      LAB_TEST: 0,
      IMAGING: 0,
    };
    
    const byPriority: Record<AppointmentPriority, number> = {
      ROUTINE: 20,
      URGENT: 3,
      EMERGENCY: 1,
      CRITICAL: 0,
    };
    
    return {
      total: 24,
      byStatus,
      byType,
      byPriority,
      today: 2,
      upcoming: 3,
      completed: 18,
      cancelled: 3,
      noShow: 0,
      averageWaitTime: 12,
      averageConsultationTime: 25,
      revenue: {
        total: 1250,
        pending: 0,
        collected: 1250,
      },
    };
  },
};

// ============================================================================
// CACHE MANAGEMENT
// ============================================================================

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class AppointmentCache {
  private static instance: AppointmentCache;
  private cache: Map<string, CacheEntry<any>> = new Map();
  
  static getInstance(): AppointmentCache {
    if (!AppointmentCache.instance) {
      AppointmentCache.instance = new AppointmentCache();
    }
    return AppointmentCache.instance;
  }
  
  get<T>(key: string, maxAge: number): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > maxAge) {
      this.cache.delete(key);
      return null;
    }
    return entry.data as T;
  }
  
  set<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }
  
  invalidate(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }
}

// ============================================================================
// HOOK IMPLEMENTATION
// ============================================================================

export const useAppointments = (options: UseAppointmentsOptions = {}): UseAppointmentsReturn => {
  const {
    initialFilters = {},
    autoFetch = true,
    cacheTime = DEFAULT_CACHE_TIME,
    retryCount = DEFAULT_RETRY_COUNT,
    retryDelay = DEFAULT_RETRY_DELAY,
  } = options;
  
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState<PatientStatistics | null>(null);
  const [detailedStats, setDetailedStats] = useState<AppointmentStatistics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetchingStats, setIsFetchingStats] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [filters, setFiltersState] = useState<AppointmentFilters>(initialFilters);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const retryCountRef = useRef<number>(0);
  const cache = AppointmentCache.getInstance();
  
  const cacheKey = useMemo(() => {
    return `appointments:${JSON.stringify(filters)}:page:${currentPage}`;
  }, [filters, currentPage]);
  
  const validateFilters = useCallback((f: AppointmentFilters): Record<string, string> => {
    const errors: Record<string, string> = {};
    
    if (f.startDate && f.endDate && f.startDate > f.endDate) {
      errors.dateRange = 'Start date cannot be after end date';
    }
    
    return errors;
  }, []);
  
  const fetchAppointments = useCallback(async (
    page: number = 1,
    isRefresh: boolean = false,
    skipCache: boolean = false
  ): Promise<void> => {
    if (!skipCache && !isRefresh && page === 1) {
      const cached = cache.get<{ data: Appointment[]; total: number; totalPages: number }>(cacheKey, cacheTime);
      if (cached) {
        setAppointments(cached.data);
        setTotalItems(cached.total);
        setTotalPages(cached.totalPages);
        return;
      }
    }
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    
    const setLoading = isRefresh ? setIsRefreshing : (page === 1 ? setIsLoading : setIsLoadingMore);
    setLoading(true);
    setError(null);
    
    try {
      const response = await appointmentService.getAppointments(filters, page, 10);
      
      if (page === 1) {
        setAppointments(response.data);
      } else {
        setAppointments(prev => [...prev, ...response.data]);
      }
      
      setTotalItems(response.total);
      setTotalPages(response.totalPages);
      setCurrentPage(page);
      
      if (page === 1) {
        cache.set(cacheKey, response);
      }
      
      retryCountRef.current = 0;
    } catch (err: any) {
      if (err.name === 'AbortError') {
        return;
      }
      
      if (retryCountRef.current < retryCount) {
        retryCountRef.current++;
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        return fetchAppointments(page, isRefresh, skipCache);
      }
      
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch appointments';
      setError(errorMessage);
      console.error('[useAppointments] Error:', err);
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  }, [filters, cacheKey, cacheTime, retryCount, retryDelay]);
  
  const fetchStats = useCallback(async (): Promise<void> => {
    setIsFetchingStats(true);
    setError(null);
    
    try {
      const [statsData, detailedStatsData] = await Promise.all([
        appointmentService.getStats(),
        appointmentService.getDetailedStats(),
      ]);
      
      setStats(statsData);
      setDetailedStats(detailedStatsData);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch statistics';
      setError(errorMessage);
      console.error('[useAppointments] Stats error:', err);
    } finally {
      setIsFetchingStats(false);
    }
  }, []);
  
  const setFilters = useCallback((
    newFilters: AppointmentFilters | ((prev: AppointmentFilters) => AppointmentFilters)
  ): void => {
    setFiltersState(prev => {
      const updated = typeof newFilters === 'function' ? newFilters(prev) : newFilters;
      const errors = validateFilters(updated);
      setValidationErrors(errors);
      
      if (Object.keys(errors).length === 0) {
        setCurrentPage(1);
        return updated;
      }
      
      return prev;
    });
  }, [validateFilters]);
  
  const resetFilters = useCallback((): void => {
    setFiltersState({});
    setValidationErrors({});
    setCurrentPage(1);
  }, []);
  
  const loadMore = useCallback(async (): Promise<void> => {
    if (currentPage < totalPages && !isLoadingMore && !isRefreshing) {
      await fetchAppointments(currentPage + 1, false);
    }
  }, [currentPage, totalPages, isLoadingMore, isRefreshing, fetchAppointments]);
  
  const refetch = useCallback(async (): Promise<void> => {
    await fetchAppointments(1, false, true);
  }, [fetchAppointments]);
  
  const refresh = useCallback(async (): Promise<void> => {
    await fetchAppointments(1, true, true);
  }, [fetchAppointments]);
  
  const invalidateCache = useCallback((): void => {
    cache.invalidate();
    refetch();
  }, [cache, refetch]);
  
  const clearError = useCallback((): void => {
    setError(null);
    setValidationErrors({});
  }, []);
  
  useEffect(() => {
    if (autoFetch) {
      fetchAppointments(1);
    }
  }, [autoFetch, filters, fetchAppointments]);
  
  useEffect(() => {
    if (autoFetch) {
      fetchStats();
    }
  }, [autoFetch, fetchStats]);
  
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);
  
  const hasMore = currentPage < totalPages;
  
  return {
    appointments,
    stats,
    detailedStats,
    isLoading,
    isFetchingStats,
    isRefreshing,
    isLoadingMore,
    error,
    validationErrors,
    filters,
    setFilters,
    resetFilters,
    hasMore,
    currentPage,
    totalPages,
    totalItems,
    loadMore,
    refetch,
    refresh,
    refetchStats: fetchStats,
    clearError,
    invalidateCache,
  };
};

export default useAppointments;