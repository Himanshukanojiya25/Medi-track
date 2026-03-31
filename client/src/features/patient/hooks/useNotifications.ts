// client/src/features/patient/hooks/useNotifications.ts

import { useState, useEffect, useCallback } from 'react';

// ============================================================================
// TYPES
// ============================================================================

export interface Notification {
  id: string;
  type: 'appointment' | 'prescription' | 'reminder' | 'message' | 'update' | 'promotion';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
  metadata?: Record<string, any>;
}

export interface NotificationFilters {
  type?: Notification['type'] | Notification['type'][];
  read?: boolean;
  fromDate?: string;
  toDate?: string;
  search?: string;
  page?: number;
  limit?: number;
}

interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  filters: NotificationFilters;
  hasMore: boolean;
  total: number;
  setFilters: (filters: NotificationFilters | ((prev: NotificationFilters) => NotificationFilters)) => void;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  deleteAllRead: () => Promise<void>;
  loadMore: () => Promise<void>;
  refetch: () => Promise<void>;
  clearError: () => void;
  resetFilters: () => void;
}

// ============================================================================
// MOCK DATA (Replace with actual API calls)
// ============================================================================

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'appointment',
    title: 'Appointment Reminder',
    message: 'You have an appointment with Dr. Sarah Johnson tomorrow at 10:00 AM',
    read: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    link: '/patient/appointments/1',
  },
  {
    id: '2',
    type: 'prescription',
    title: 'Prescription Ready',
    message: 'Your prescription has been renewed by Dr. Michael Chen',
    read: false,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    link: '/patient/prescriptions/2',
  },
  {
    id: '3',
    type: 'reminder',
    title: 'Medication Reminder',
    message: 'Time to take your evening medication',
    read: true,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    link: '/patient/medications',
  },
];

const notificationsService = {
  getNotifications: async (
    filters?: NotificationFilters,
    page: number = 1,
    limit: number = 20
  ): Promise<{ data: Notification[]; total: number; totalPages: number }> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filtered = [...mockNotifications];
    
    if (filters?.type) {
      const types = Array.isArray(filters.type) ? filters.type : [filters.type];
      filtered = filtered.filter(n => types.includes(n.type));
    }
    
    if (filters?.read !== undefined) {
      filtered = filtered.filter(n => n.read === filters.read);
    }
    
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(searchLower) ||
        n.message.toLowerCase().includes(searchLower)
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
  
  markAsRead: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
  },
  
  markAllAsRead: async (): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
  },
  
  deleteNotification: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
  },
  
  deleteAllRead: async (): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
  },
};

// ============================================================================
// HOOK IMPLEMENTATION
// ============================================================================

export const useNotifications = (initialFilters?: NotificationFilters): UseNotificationsReturn => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] = useState<NotificationFilters>(initialFilters || {});
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  const clearError = useCallback(() => setError(null), []);
  const resetFilters = useCallback(() => {
    setFiltersState({});
    setCurrentPage(1);
  }, []);

  const fetchNotifications = useCallback(async (page: number = 1, append: boolean = false): Promise<void> => {
    const setLoading = page === 1 ? setIsLoading : setIsLoadingMore;
    setLoading(true);
    setError(null);
    
    try {
      const response = await notificationsService.getNotifications(filters, page, 20);
      
      if (append) {
        setNotifications(prev => [...prev, ...response.data]);
      } else {
        setNotifications(response.data);
      }
      
      setTotal(response.total);
      setTotalPages(response.totalPages);
      setCurrentPage(page);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch notifications';
      setError(errorMessage);
      console.error('[useNotifications] Error:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const setFilters = useCallback((
    newFilters: NotificationFilters | ((prev: NotificationFilters) => NotificationFilters)
  ): void => {
    setFiltersState(prev => {
      const updated = typeof newFilters === 'function' ? newFilters(prev) : newFilters;
      setCurrentPage(1);
      return updated;
    });
  }, []);

  const markAsRead = useCallback(async (id: string): Promise<void> => {
    try {
      await notificationsService.markAsRead(id);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to mark notification as read';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const markAllAsRead = useCallback(async (): Promise<void> => {
    try {
      await notificationsService.markAllAsRead();
      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true }))
      );
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to mark all as read';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const deleteNotification = useCallback(async (id: string): Promise<void> => {
    try {
      await notificationsService.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to delete notification';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const deleteAllRead = useCallback(async (): Promise<void> => {
    try {
      await notificationsService.deleteAllRead();
      setNotifications(prev => prev.filter(n => !n.read));
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to delete read notifications';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const loadMore = useCallback(async (): Promise<void> => {
    if (currentPage < totalPages && !isLoadingMore) {
      await fetchNotifications(currentPage + 1, true);
    }
  }, [currentPage, totalPages, isLoadingMore, fetchNotifications]);

  const refetch = useCallback(async (): Promise<void> => {
    await fetchNotifications(1, false);
  }, [fetchNotifications]);

  useEffect(() => {
    fetchNotifications(1, false);
  }, [filters, fetchNotifications]);

  const unreadCount = notifications.filter(n => !n.read).length;
  const hasMore = currentPage < totalPages;

  return {
    notifications,
    unreadCount,
    isLoading,
    isLoadingMore,
    error,
    filters,
    hasMore,
    total,
    setFilters,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllRead,
    loadMore,
    refetch,
    clearError,
    resetFilters,
  };
};

export default useNotifications;