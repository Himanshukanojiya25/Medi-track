// client/src/services/auth/auth.service.ts
import { createApiClient } from '../../lib/api/http.client';

// Create auth API client
const authClient = createApiClient(import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1');

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phone: string;
  dateOfBirth: string;
  role: 'PATIENT' | 'DOCTOR' | 'HOSPITAL_ADMIN';
}

export interface LoginResponseData {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    role: 'SUPER_ADMIN' | 'HOSPITAL_ADMIN' | 'DOCTOR' | 'PATIENT';
    hospitalId?: string;
    name?: string;
    email?: string;
  };
}

export interface AuthUser {
  id: string;
  role: string;
  hospitalId?: string;
  name?: string;
  email?: string;
}

class AuthService {
  private static TOKEN_KEY = 'access_token';
  private static REFRESH_KEY = 'refresh_token';
  private static USER_KEY = 'auth_user';

  /**
   * Login user (automatically detects role)
   */
  static async login(credentials: LoginRequest): Promise<AuthUser> {
    try {
      console.log('Login attempt:', credentials.email);
      
      const response = await authClient.post<{ success: boolean; data: LoginResponseData }>(
        '/auth/login', 
        credentials
      );
      
      console.log('Login response:', response);
      
      const { accessToken, refreshToken, user } = response.data.data;
      
      this.setAccessToken(accessToken);
      this.setRefreshToken(refreshToken);
      this.setUser(user);
      
      authClient.setAuthToken(accessToken);
      
      console.log('Login successful for:', user.email);
      
      return user;
    } catch (error: any) {
      console.error('Login service error:', error);
      console.error('Error response:', error.response);
      throw error;
    }
  }

  /**
   * Register new user
   */
  static async register(data: RegisterRequest): Promise<AuthUser> {
    try {
      console.log('Register attempt:', data.email);
      
      const response = await authClient.post<{ success: boolean; data: LoginResponseData }>(
        '/auth/register',
        data
      );
      
      console.log('Register response:', response);
      
      const { accessToken, refreshToken, user } = response.data.data;
      
      this.setAccessToken(accessToken);
      this.setRefreshToken(refreshToken);
      this.setUser(user);
      
      authClient.setAuthToken(accessToken);
      
      console.log('Registration successful for:', user.email);
      
      return user;
    } catch (error: any) {
      console.error('Register service error:', error);
      console.error('Error response:', error.response);
      throw error;
    }
  }

  /**
   * Logout current user
   */
  static async logout(): Promise<void> {
    const refreshToken = this.getRefreshToken();
    
    if (refreshToken) {
      try {
        await authClient.post('/auth/logout', { refreshToken });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    
    this.clearAuth();
    authClient.removeAuthToken();
  }

  /**
   * Refresh access token
   */
  static async refreshToken(): Promise<string | null> {
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) return null;
    
    try {
      const response = await authClient.post<{ success: boolean; data: { accessToken: string; refreshToken: string } }>(
        '/auth/refresh',
        { refreshToken }
      );
      
      const { accessToken, refreshToken: newRefreshToken } = response.data.data;
      this.setAccessToken(accessToken);
      this.setRefreshToken(newRefreshToken);
      authClient.setAuthToken(accessToken);
      
      return accessToken;
    } catch (error) {
      this.clearAuth();
      authClient.removeAuthToken();
      return null;
    }
  }

  /**
   * Get current user from storage
   */
  static getCurrentUser(): AuthUser | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    return !!this.getAccessToken() && !!this.getCurrentUser();
  }

  /**
   * Check if user has specific role
   */
  static hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  /**
   * Get access token
   */
  static getAccessToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Get refresh token
   */
  static getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_KEY);
  }

  /**
   * Set access token
   */
  private static setAccessToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * Set refresh token
   */
  private static setRefreshToken(token: string): void {
    localStorage.setItem(this.REFRESH_KEY, token);
  }

  /**
   * Set user data
   */
  private static setUser(user: any): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  /**
   * Clear all auth data
   */
  private static clearAuth(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  // ============================================================================
  // ADDED METHODS FOR useAuth HOOK
  // ============================================================================

  /**
   * Set token (alias for setAccessToken)
   */
  static setToken(token: string): void {
    this.setAccessToken(token);
    authClient.setAuthToken(token);
  }

  /**
   * Get token (alias for getAccessToken)
   */
  static getToken(): string | null {
    return this.getAccessToken();
  }

  /**
   * Clear token (alias for clearAuth)
   */
  static clearToken(): void {
    this.clearAuth();
    authClient.removeAuthToken();
  }

  /**
   * Update current user in storage
   */
  static updateUser(updatedUser: Partial<AuthUser>): void {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      const newUser = { ...currentUser, ...updatedUser };
      localStorage.setItem(this.USER_KEY, JSON.stringify(newUser));
    }
  }
}

export default AuthService;