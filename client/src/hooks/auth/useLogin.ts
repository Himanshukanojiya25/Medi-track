// client/src/hooks/auth/useLogin.ts

import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/auth/auth.service';
import { ROLES, ROLE_DASHBOARD_ROUTES, ROLE_DISPLAY_NAMES } from '../../app/constants/role.constants';
import type { AppRole } from '../../app/constants/role.constants';

// ============================================================================
// TYPES
// ============================================================================

export interface UseLoginOptions {
  redirectOnSuccess?: boolean;
  storeTokens?: boolean;
  onSuccess?: (user: any) => void;
  onError?: (error: Error) => void;
}

export interface UseLoginReturn {
  login: (email: string, password: string, redirectTo?: string) => Promise<any>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
  lastAttempt: {
    email: string;
    timestamp: number;
    success: boolean;
  } | null;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

// ============================================================================
// ROLE MAPPING
// ============================================================================

/**
 * Map backend roles to frontend roles
 * Supports both uppercase and lowercase role strings
 */
const mapBackendRoleToAppRole = (backendRole: string): AppRole => {
  console.log('[useLogin] Mapping role:', backendRole);
  
  const normalizedRole = backendRole?.toUpperCase?.() || '';
  
  const roleMap: Record<string, AppRole> = {
    'SUPER_ADMIN': ROLES.SUPER_ADMIN,
    'HOSPITAL_ADMIN': ROLES.HOSPITAL_ADMIN,
    'DOCTOR': ROLES.DOCTOR,
    'PATIENT': ROLES.PATIENT,
    'SUPERADMIN': ROLES.SUPER_ADMIN,
    'HOSPITALADMIN': ROLES.HOSPITAL_ADMIN,
  };
  
  const mappedRole = roleMap[normalizedRole] || ROLES.PATIENT;
  console.log('[useLogin] Mapped role:', mappedRole);
  return mappedRole;
};

/**
 * Get dashboard route for a role with validation
 */
const getDashboardRoute = (role: AppRole): string => {
  const route = ROLE_DASHBOARD_ROUTES[role];
  if (!route) {
    console.error(`[useLogin] No dashboard route found for role: ${role}`);
    return '/';
  }
  console.log(`[useLogin] Dashboard route for ${role}: ${route}`);
  return route;
};

// ============================================================================
// LOGIN ATTEMPT TRACKING
// ============================================================================

interface LoginAttempt {
  email: string;
  timestamp: number;
  success: boolean;
}

class LoginAttemptTracker {
  private attempts: Map<string, LoginAttempt[]> = new Map();
  
  addAttempt(email: string, success: boolean): void {
    const normalizedEmail = email.toLowerCase();
    const attempts = this.attempts.get(normalizedEmail) || [];
    attempts.push({
      email: normalizedEmail,
      timestamp: Date.now(),
      success,
    });
    
    // Keep only last 10 attempts
    if (attempts.length > 10) {
      attempts.shift();
    }
    
    this.attempts.set(normalizedEmail, attempts);
  }
  
  getFailedAttempts(email: string, withinMs: number = LOCKOUT_DURATION): number {
    const normalizedEmail = email.toLowerCase();
    const attempts = this.attempts.get(normalizedEmail) || [];
    const now = Date.now();
    
    return attempts.filter(a => 
      !a.success && (now - a.timestamp) < withinMs
    ).length;
  }
  
  isLockedOut(email: string): boolean {
    const failedAttempts = this.getFailedAttempts(email);
    return failedAttempts >= MAX_LOGIN_ATTEMPTS;
  }
  
  getRemainingLockoutTime(email: string): number {
    const normalizedEmail = email.toLowerCase();
    const attempts = this.attempts.get(normalizedEmail) || [];
    const now = Date.now();
    
    const failedAttempts = attempts.filter(a => !a.success);
    if (failedAttempts.length < MAX_LOGIN_ATTEMPTS) {
      return 0;
    }
    
    const oldestFailedAttempt = failedAttempts[failedAttempts.length - MAX_LOGIN_ATTEMPTS];
    if (!oldestFailedAttempt) return 0;
    
    const lockoutEnd = oldestFailedAttempt.timestamp + LOCKOUT_DURATION;
    const remaining = lockoutEnd - now;
    
    return remaining > 0 ? remaining : 0;
  }
}

const loginTracker = new LoginAttemptTracker();

// ============================================================================
// HOOK IMPLEMENTATION
// ============================================================================

export function useLogin(options: UseLoginOptions = {}): UseLoginReturn {
  const { 
    redirectOnSuccess = true, 
    onSuccess,
    onError 
  } = options;
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastAttempt, setLastAttempt] = useState<{ email: string; timestamp: number; success: boolean } | null>(null);
  
  const navigate = useNavigate();
  const abortControllerRef = useRef<AbortController | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Handle post-login redirection
   */
  const handleRedirect = useCallback((userRole: AppRole, customRedirect?: string): void => {
    if (!redirectOnSuccess) return;
    
    try {
      if (customRedirect) {
        console.log('[useLogin] Redirecting to custom URL:', customRedirect);
        navigate(customRedirect);
        return;
      }
      
      const dashboardRoute = getDashboardRoute(userRole);
      console.log('[useLogin] Redirecting to dashboard:', dashboardRoute);
      navigate(dashboardRoute);
    } catch (err) {
      console.error('[useLogin] Redirect failed:', err);
      // Fallback redirect
      navigate('/');
    }
  }, [redirectOnSuccess, navigate]);

  /**
   * Main login function
   */
  const login = useCallback(async (email: string, password: string, redirectTo?: string) => {
    // Cancel any in-progress login attempt
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    
    setIsLoading(true);
    setError(null);
    
    const normalizedEmail = email.toLowerCase().trim();
    
    // Check if account is locked out
    if (loginTracker.isLockedOut(normalizedEmail)) {
      const remainingTime = loginTracker.getRemainingLockoutTime(normalizedEmail);
      const minutesLeft = Math.ceil(remainingTime / 60000);
      const errorMsg = `Too many failed attempts. Please try again in ${minutesLeft} minute${minutesLeft !== 1 ? 's' : ''}.`;
      setError(errorMsg);
      setIsLoading(false);
      if (onError) onError(new Error(errorMsg));
      throw new Error(errorMsg);
    }
    
    try {
      console.log('[useLogin] Attempting login for:', normalizedEmail);
      
      // Call auth service - this returns AuthUser (without tokens)
      const user = await AuthService.login({ email: normalizedEmail, password });
      
      if (!user) {
        throw new Error('Invalid response from server');
      }
      
      console.log('[useLogin] Login successful');
      console.log('[useLogin] User role from backend:', user.role);
      
      // Track successful attempt
      loginTracker.addAttempt(normalizedEmail, true);
      setLastAttempt({
        email: normalizedEmail,
        timestamp: Date.now(),
        success: true,
      });
      
      // Map role and get dashboard route
      const appRole = mapBackendRoleToAppRole(user.role);
      const roleDisplayName = ROLE_DISPLAY_NAMES[appRole];
      console.log('[useLogin] User role mapped to:', appRole, `(${roleDisplayName})`);
      
      // Note: Tokens are already stored by AuthService.login()
      // No need to store them again here
      
      // Trigger success callback
      if (onSuccess) onSuccess(user);
      
      // Handle redirect
      handleRedirect(appRole, redirectTo);
      
      return user;
      
    } catch (err: any) {
      console.error('[useLogin] Login error:', err);
      
      // Track failed attempt
      loginTracker.addAttempt(normalizedEmail, false);
      setLastAttempt({
        email: normalizedEmail,
        timestamp: Date.now(),
        success: false,
      });
      
      // Extract meaningful error message
      let message = 'Login failed. Please check your credentials and try again.';
      
      if (err.response?.data?.message) {
        message = err.response.data.message;
      } else if (err.response?.data?.error) {
        message = err.response.data.error;
      } else if (err.message) {
        message = err.message;
      }
      
      // Check if this is an invalid credentials error
      if (message.toLowerCase().includes('invalid') || message.toLowerCase().includes('password')) {
        const failedAttempts = loginTracker.getFailedAttempts(normalizedEmail);
        const remainingAttempts = MAX_LOGIN_ATTEMPTS - failedAttempts;
        
        if (remainingAttempts > 0) {
          message = `${message} You have ${remainingAttempts} attempt${remainingAttempts !== 1 ? 's' : ''} remaining.`;
        } else {
          message = 'Too many failed attempts. Your account is temporarily locked. Please try again later.';
        }
      }
      
      setError(message);
      if (onError) onError(err);
      throw err;
      
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [handleRedirect, onSuccess, onError]);

  return {
    login,
    isLoading,
    error,
    clearError,
    lastAttempt,
  };
}

export default useLogin;