/**
 * @fileoverview Token Service - Enterprise Grade Token Management
 * @module services/auth/token.service
 * 
 * Features:
 * - JWT token storage and retrieval
 * - Token validation and expiration check
 * - Secure token handling
 * - Token refresh management
 * - Multi-token support (access, refresh)
 */

// ============================================================================
// TYPES
// ============================================================================

export interface TokenPayload {
  id: string;
  role: string;
  hospitalId?: string;
  iat?: number;
  exp?: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface StoredTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt?: number;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  TOKEN_EXPIRY: 'token_expiry',
} as const;

// ============================================================================
// TOKEN SERVICE CLASS
// ============================================================================

export class TokenService {
  private static instance: TokenService;
  private tokenRefreshPromise: Promise<string> | null = null;

  private constructor() {}

  static getInstance(): TokenService {
    if (!TokenService.instance) {
      TokenService.instance = new TokenService();
    }
    return TokenService.instance;
  }

  // ==========================================================================
  // TOKEN STORAGE
  // ==========================================================================

  /**
   * Store access token
   */
  setAccessToken(token: string): void {
    if (!token) {
      console.warn('Attempted to set empty access token');
      return;
    }
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
  }

  /**
   * Get access token
   */
  getAccessToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  /**
   * Store refresh token
   */
  setRefreshToken(token: string): void {
    if (!token) {
      console.warn('Attempted to set empty refresh token');
      return;
    }
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
  }

  /**
   * Get refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  /**
   * Store both tokens
   */
  setTokens(accessToken: string, refreshToken: string): void {
    this.setAccessToken(accessToken);
    this.setRefreshToken(refreshToken);
  }

  /**
   * Get both tokens
   */
  getTokens(): TokenPair | null {
    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();

    if (!accessToken || !refreshToken) {
      return null;
    }

    return { accessToken, refreshToken };
  }

  // ==========================================================================
  // TOKEN VALIDATION
  // ==========================================================================

  /**
   * Check if token exists
   */
  hasToken(): boolean {
    return !!this.getAccessToken();
  }

  /**
   * Check if refresh token exists
   */
  hasRefreshToken(): boolean {
    return !!this.getRefreshToken();
  }

  /**
   * Validate JWT token format
   */
  isValidTokenFormat(token: string): boolean {
    if (!token || typeof token !== 'string') return false;
    
    // JWT format: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    try {
      // Check if payload is valid base64
      const payload = JSON.parse(atob(parts[1]));
      return payload && typeof payload === 'object';
    } catch {
      return false;
    }
  }

  /**
   * Decode JWT payload without verification
   */
  decodeToken(token: string): TokenPayload | null {
    if (!this.isValidTokenFormat(token)) return null;
    
    try {
      const parts = token.split('.');
      const payload = JSON.parse(atob(parts[1]));
      return payload as TokenPayload;
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  }

  /**
   * Check if token is expired
   */
  isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) return true;
    
    // exp is in seconds, Date.now() is in milliseconds
    return decoded.exp * 1000 < Date.now();
  }

  /**
   * Get token expiration time
   */
  getTokenExpiry(token: string): Date | null {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) return null;
    
    return new Date(decoded.exp * 1000);
  }

  /**
   * Check if token is about to expire (within 5 minutes)
   */
  isTokenExpiringSoon(token: string, thresholdMinutes: number = 5): boolean {
    const expiry = this.getTokenExpiry(token);
    if (!expiry) return true;
    
    const thresholdMs = thresholdMinutes * 60 * 1000;
    return expiry.getTime() - Date.now() < thresholdMs;
  }

  // ==========================================================================
  // TOKEN REFRESH
  // ==========================================================================

  /**
   * Set token refresh promise to prevent multiple simultaneous refreshes
   */
  setRefreshPromise(promise: Promise<string> | null): void {
    this.tokenRefreshPromise = promise;
  }

  /**
   * Get current refresh promise
   */
  getRefreshPromise(): Promise<string> | null {
    return this.tokenRefreshPromise;
  }

  /**
   * Clear refresh promise
   */
  clearRefreshPromise(): void {
    this.tokenRefreshPromise = null;
  }

  // ==========================================================================
  // TOKEN CLEANUP
  // ==========================================================================

  /**
   * Clear all tokens
   */
  clearTokens(): void {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRY);
  }

  /**
   * Clear expired tokens
   */
  clearExpiredTokens(): void {
    const accessToken = this.getAccessToken();
    if (accessToken && this.isTokenExpired(accessToken)) {
      this.clearTokens();
    }
  }

  // ==========================================================================
  // SECURITY
  // ==========================================================================

  /**
   * Mask token for logging (show only first and last 4 chars)
   */
  maskToken(token: string): string {
    if (!token || token.length < 8) return '***';
    return `${token.slice(0, 4)}...${token.slice(-4)}`;
  }

  /**
   * Check if token is blacklisted (optional - integrate with backend)
   */
  isTokenBlacklisted(token: string): boolean {
    // This would typically check with backend or local blacklist
    const blacklistedTokens = this.getBlacklistedTokens();
    return blacklistedTokens.includes(token);
  }

  /**
   * Get blacklisted tokens from storage
   */
  private getBlacklistedTokens(): string[] {
    try {
      const blacklist = localStorage.getItem('token_blacklist');
      return blacklist ? JSON.parse(blacklist) : [];
    } catch {
      return [];
    }
  }

  /**
   * Add token to blacklist (on logout)
   */
  addToBlacklist(token: string): void {
    try {
      const blacklist = this.getBlacklistedTokens();
      if (!blacklist.includes(token)) {
        blacklist.push(token);
        localStorage.setItem('token_blacklist', JSON.stringify(blacklist));
      }
    } catch (error) {
      console.error('Failed to add token to blacklist:', error);
    }
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

export const tokenService = TokenService.getInstance();
export default tokenService;