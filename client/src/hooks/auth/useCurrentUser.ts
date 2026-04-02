// client/src/hooks/auth/useCurrentUser.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './useAuth';

// ============================================================================
// TYPES
// ============================================================================

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: 'patient' | 'doctor' | 'hospital_admin' | 'super_admin';
  avatar?: string;
  phone?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  twoFactorEnabled: boolean;
  lastLoginAt?: string;
  permissions: string[];
  hospitalId?: string;
  hospitalName?: string;
  doctorId?: string;
  patientId?: string;
  preferences?: {
    language: string;
    timezone: string;
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };
  stats?: {
    totalAppointments: number;
    completedAppointments: number;
    upcomingAppointments: number;
    totalPatients?: number;
    totalEarnings?: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UseCurrentUserOptions {
  autoFetch?: boolean;
  includeStats?: boolean;
  includePreferences?: boolean;
  refetchInterval?: number | false;
}

export interface UseCurrentUserReturn {
  user: CurrentUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateUser: (data: Partial<CurrentUser>) => void;
  clearError: () => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (roles: string | string[]) => boolean;
  isPatient: boolean;
  isDoctor: boolean;
  isHospitalAdmin: boolean;
  isSuperAdmin: boolean;
  getDisplayName: () => string;
  getInitials: () => string;
  getRoleDisplayName: () => string;
  getDashboardUrl: () => string;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const getInitialsHelper = (name: string): string => {
  if (!name) return 'U';
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const getRoleDisplayNameHelper = (role: string): string => {
  const roleMap: Record<string, string> = {
    patient: 'Patient',
    doctor: 'Doctor',
    hospital_admin: 'Hospital Admin',
    super_admin: 'Super Admin',
  };
  return roleMap[role] || role;
};

const getDashboardUrlHelper = (role: string): string => {
  const dashboardMap: Record<string, string> = {
    patient: '/patient/dashboard',
    doctor: '/doctor/dashboard',
    hospital_admin: '/hospital-admin/dashboard',
    super_admin: '/super-admin/dashboard',
  };
  return dashboardMap[role] || '/';
};

// ============================================================================
// HOOK IMPLEMENTATION
// ============================================================================

export const useCurrentUser = (options: UseCurrentUserOptions = {}): UseCurrentUserReturn => {
  const {
    autoFetch = true,
    includeStats = false,
    includePreferences = false,
    refetchInterval = false,
  } = options;

  const { user: authUser, isLoading: authLoading, isAuthenticated, error: authError, updateUser: authUpdateUser } = useAuth();
  
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isMountedRef = useRef(true);

  // Clear interval on unmount
  const clearIntervalRef = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Fetch additional user data (stats, preferences)
  const fetchAdditionalData = useCallback(async (): Promise<Partial<CurrentUser>> => {
    const additionalData: Partial<CurrentUser> = {};
    
    try {
      if (includeStats) {
        // Mock API call - replace with actual
        await new Promise(resolve => setTimeout(resolve, 300));
        additionalData.stats = {
          totalAppointments: 24,
          completedAppointments: 18,
          upcomingAppointments: 3,
          totalPatients: authUser?.role === 'doctor' ? 156 : undefined,
          totalEarnings: authUser?.role === 'doctor' ? 12500 : undefined,
        };
      }
      
      if (includePreferences) {
        // Mock API call - replace with actual
        await new Promise(resolve => setTimeout(resolve, 200));
        additionalData.preferences = {
          language: 'en',
          timezone: 'Asia/Kolkata',
          notifications: {
            email: true,
            sms: true,
            push: true,
          },
        };
      }
    } catch (err) {
      console.error('[useCurrentUser] Error fetching additional data:', err);
    }
    
    return additionalData;
  }, [includeStats, includePreferences, authUser?.role]);

  // Build full user object
  const buildUser = useCallback(async (authUserData: any): Promise<CurrentUser | null> => {
    if (!authUserData) return null;
    
    const additionalData = await fetchAdditionalData();
    
    return {
      id: authUserData.id,
      name: authUserData.name || '',
      email: authUserData.email || '',
      role: authUserData.role || 'patient',
      avatar: authUserData.avatar,
      phone: authUserData.phone,
      emailVerified: authUserData.emailVerified ?? false,
      phoneVerified: authUserData.phoneVerified ?? false,
      twoFactorEnabled: authUserData.twoFactorEnabled ?? false,
      lastLoginAt: authUserData.lastLoginAt,
      permissions: authUserData.permissions || [],
      hospitalId: authUserData.hospitalId,
      hospitalName: authUserData.hospitalName,
      doctorId: authUserData.doctorId,
      patientId: authUserData.patientId,
      createdAt: authUserData.createdAt || new Date().toISOString(),
      updatedAt: authUserData.updatedAt || new Date().toISOString(),
      ...additionalData,
    };
  }, [fetchAdditionalData]);

  // Fetch current user
  const fetchCurrentUser = useCallback(async (): Promise<void> => {
    if (!isMountedRef.current) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      if (!authUser) {
        setUser(null);
        return;
      }
      
      const fullUser = await buildUser(authUser);
      
      if (isMountedRef.current) {
        setUser(fullUser);
      }
    } catch (err: any) {
      console.error('[useCurrentUser] Error fetching user:', err);
      if (isMountedRef.current) {
        setError(err.message || 'Failed to fetch user data');
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [authUser, buildUser]);

  // Update user data
  const updateUser = useCallback((data: Partial<CurrentUser>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...data, updatedAt: new Date().toISOString() };
    setUser(updatedUser);
    
    // Update in auth context as well
    authUpdateUser({
      name: data.name,
      avatar: data.avatar,
      phone: data.phone,
    });
  }, [user, authUpdateUser]);

  // Refetch user data
  const refetch = useCallback(async (): Promise<void> => {
    await fetchCurrentUser();
  }, [fetchCurrentUser]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Permission check
  const hasPermission = useCallback((permission: string): boolean => {
    return user?.permissions?.includes(permission) || false;
  }, [user]);

  // Role check
  const hasRole = useCallback((roles: string | string[]): boolean => {
    if (!user) return false;
    const roleList = Array.isArray(roles) ? roles : [roles];
    return roleList.some(role => user.role === role);
  }, [user]);

  // Role helpers
  const isPatient = user?.role === 'patient';
  const isDoctor = user?.role === 'doctor';
  const isHospitalAdmin = user?.role === 'hospital_admin';
  const isSuperAdmin = user?.role === 'super_admin';

  // Get display name
  const getDisplayName = useCallback((): string => {
    return user?.name || 'User';
  }, [user]);

  // Get initials
  const getInitials = useCallback((): string => {
    return getInitialsHelper(user?.name || '');
  }, [user]);

  // Get role display name
  const getRoleDisplayNameCallback = useCallback((): string => {
    return getRoleDisplayNameHelper(user?.role || '');
  }, [user]);

  // Get dashboard URL
  const getDashboardUrlCallback = useCallback((): string => {
    return getDashboardUrlHelper(user?.role || '');
  }, [user]);

  // Setup auto-refetch interval
  useEffect(() => {
    if (refetchInterval && refetchInterval > 0 && isAuthenticated && user) {
      clearIntervalRef();
      intervalRef.current = setInterval(() => {
        if (isMountedRef.current) {
          fetchCurrentUser();
        }
      }, refetchInterval);
    }
    
    return clearIntervalRef;
  }, [refetchInterval, isAuthenticated, user, fetchCurrentUser, clearIntervalRef]);

  // Fetch user on mount or when authUser changes
  useEffect(() => {
    if (autoFetch) {
      fetchCurrentUser();
    }
  }, [autoFetch, fetchCurrentUser]);

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      clearIntervalRef();
    };
  }, [clearIntervalRef]);

  // Derive loading state
  const finalLoading = authLoading || isLoading;

  return {
    user,
    isLoading: finalLoading,
    isAuthenticated,
    error: authError || error,
    refetch,
    updateUser,
    clearError,
    hasPermission,
    hasRole,
    isPatient,
    isDoctor,
    isHospitalAdmin,
    isSuperAdmin,
    getDisplayName,
    getInitials,
    getRoleDisplayName: getRoleDisplayNameCallback,
    getDashboardUrl: getDashboardUrlCallback,
  };
};

export default useCurrentUser;