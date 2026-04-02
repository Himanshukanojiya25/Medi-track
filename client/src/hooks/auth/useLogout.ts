// client/src/hooks/auth/useLogout.ts
import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';

// ============================================================================
// TYPES
// ============================================================================

export interface UseLogoutOptions {
  redirectTo?: string;
  clearStorage?: boolean;
  clearCookies?: boolean;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export interface UseLogoutReturn {
  logout: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
  isLoggingOut: boolean;
}

// ============================================================================
// HOOK IMPLEMENTATION
// ============================================================================

export const useLogout = (options: UseLogoutOptions = {}): UseLogoutReturn => {
  const {
    redirectTo = '/login',
    clearStorage = true,
    clearCookies = true,
    onSuccess,
    onError,
  } = options;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  
  const navigate = useNavigate();
  const { logout: authLogout, clearError: authClearError } = useAuth();
  const abortControllerRef = useRef<AbortController | null>(null);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
    authClearError();
  }, [authClearError]);

  // Clear all storage
  const clearAllStorage = useCallback(() => {
    if (clearStorage) {
      localStorage.clear();
      sessionStorage.clear();
    }
  }, [clearStorage]);

  // Clear cookies
  const clearAllCookies = useCallback(() => {
    if (clearCookies) {
      document.cookie.split(';').forEach(cookie => {
        document.cookie = cookie
          .replace(/^ +/, '')
          .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
      });
    }
  }, [clearCookies]);

  // Logout function
  const logout = useCallback(async (): Promise<void> => {
    // Prevent multiple logout attempts
    if (isLoggingOut) {
      console.log('[useLogout] Logout already in progress');
      return;
    }
    
    // Cancel any in-progress request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    setIsLoading(true);
    setError(null);
    setIsLoggingOut(true);
    
    try {
      console.log('[useLogout] Starting logout process...');
      
      // Call auth service logout
      await authLogout();
      
      console.log('[useLogout] Auth logout completed');
      
      // Clear all storage
      clearAllStorage();
      
      // Clear all cookies
      clearAllCookies();
      
      // Clear any pending timeouts/intervals
      const highestTimeoutId = setTimeout(() => {}, 0);
      for (let i = 0; i < highestTimeoutId; i++) {
        clearTimeout(i);
      }
      
      // Trigger success callback
      if (onSuccess) {
        onSuccess();
      }
      
      // Navigate to login page
      console.log('[useLogout] Redirecting to:', redirectTo);
      navigate(redirectTo, { replace: true });
      
    } catch (err: any) {
      console.error('[useLogout] Logout error:', err);
      
      let message = 'Logout failed. Please try again.';
      
      if (err.response?.data?.message) {
        message = err.response.data.message;
      } else if (err.message) {
        message = err.message;
      }
      
      setError(message);
      if (onError) onError(new Error(message));
      
      // Even if API fails, still clear local data
      clearAllStorage();
      clearAllCookies();
      
      // Still redirect
      navigate(redirectTo, { replace: true });
      
    } finally {
      setIsLoading(false);
      setIsLoggingOut(false);
      abortControllerRef.current = null;
    }
  }, [authLogout, clearAllStorage, clearAllCookies, navigate, redirectTo, onSuccess, onError, isLoggingOut]);

  return {
    logout,
    isLoading,
    error,
    clearError,
    isLoggingOut,
  };
};

export default useLogout;