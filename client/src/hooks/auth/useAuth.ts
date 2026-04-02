// client/src/hooks/auth/useAuth.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService, { AuthUser } from '../../services/auth/auth.service';

// ============================================================================
// TYPES
// ============================================================================

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'patient' | 'doctor' | 'hospital_admin' | 'super_admin';
  avatar?: string;
  phone?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  twoFactorEnabled: boolean;
  permissions: string[];
  hospitalId?: string;
  hospitalName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  token: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface UseAuthReturn extends AuthState {
  login: (credentials: LoginCredentials) => Promise<User>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => void;
  clearError: () => void;
  hasRole: (roles: string | string[]) => boolean;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const formatAuthUserToUser = (authUser: AuthUser): User => {
  // Ensure email is always a string
  const email = authUser.email || '';
  
  return {
    id: authUser.id,
    name: authUser.name || email.split('@')[0] || 'User',
    email: email,
    role: (authUser.role?.toLowerCase() as any) || 'patient',
    avatar: undefined,
    phone: undefined,
    emailVerified: false,
    phoneVerified: false,
    twoFactorEnabled: false,
    permissions: [],
    hospitalId: authUser.hospitalId,
    hospitalName: undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

// ============================================================================
// HOOK IMPLEMENTATION
// ============================================================================

export const useAuth = (): UseAuthReturn => {
  const navigate = useNavigate();
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
    token: null,
  });

  const isMountedRef = useRef(true);

  // Load auth state from AuthService
  const loadAuthState = useCallback(() => {
    try {
      const isAuthenticated = AuthService.isAuthenticated();
      const authUser = AuthService.getCurrentUser();
      const token = AuthService.getAccessToken();
      
      console.log('[useAuth] loadAuthState - isAuthenticated:', isAuthenticated);
      console.log('[useAuth] loadAuthState - authUser:', authUser);
      
      if (isAuthenticated && authUser && token) {
        const user = formatAuthUserToUser(authUser);
        return { user, isAuthenticated: true, token, error: null };
      }
      
      return { user: null, isAuthenticated: false, token: null, error: null };
    } catch (error) {
      console.error('[useAuth] loadAuthState error:', error);
      return { user: null, isAuthenticated: false, token: null, error: 'Failed to load auth state' };
    }
  }, []);

  // Initialize auth state
  const initAuth = useCallback(() => {
    if (!isMountedRef.current) return;
    
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const { user, isAuthenticated, token, error } = loadAuthState();
      
      setState({
        user,
        isLoading: false,
        isAuthenticated,
        error,
        token,
      });
    } catch (error) {
      console.error('[useAuth] Init error:', error);
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: 'Failed to initialize authentication',
        token: null,
      });
    }
  }, [loadAuthState]);

  // Login
  const login = useCallback(async (credentials: LoginCredentials): Promise<User> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const authUser = await AuthService.login({ 
        email: credentials.email, 
        password: credentials.password 
      });
      
      const user = formatAuthUserToUser(authUser);
      const token = AuthService.getAccessToken();
      
      setState({
        user,
        isLoading: false,
        isAuthenticated: true,
        error: null,
        token,
      });
      
      return user;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
        isAuthenticated: false,
      }));
      throw new Error(errorMessage);
    }
  }, []);

  // Logout
  const logout = useCallback(async (): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      await AuthService.logout();
    } catch (error) {
      console.error('[useAuth] Logout API error:', error);
    } finally {
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
        token: null,
      });
      
      navigate('/login');
    }
  }, [navigate]);

  // Update user data
  const updateUser = useCallback((data: Partial<User>) => {
    if (!state.user) return;
    
    const updatedUser = { ...state.user, ...data, updatedAt: new Date().toISOString() };
    
    // Update in AuthService if needed
    const currentAuthUser = AuthService.getCurrentUser();
    if (currentAuthUser) {
      const updatedAuthUser = { ...currentAuthUser, name: data.name };
      localStorage.setItem('auth_user', JSON.stringify(updatedAuthUser));
    }
    
    setState(prev => ({
      ...prev,
      user: updatedUser,
    }));
  }, [state.user]);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Check role
  const hasRole = useCallback((roles: string | string[]): boolean => {
    if (!state.user) return false;
    const roleList = Array.isArray(roles) ? roles : [roles];
    return roleList.some(role => state.user!.role === role);
  }, [state.user]);

  // Initialize on mount
  useEffect(() => {
    isMountedRef.current = true;
    initAuth();
    
    return () => {
      isMountedRef.current = false;
    };
  }, [initAuth]);

  return {
    ...state,
    login,
    logout,
    updateUser,
    clearError,
    hasRole,
  };
};

export default useAuth;