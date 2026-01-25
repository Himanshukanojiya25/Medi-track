import { apiClient } from '../../config';

/**
 * This bootstrap runs ONCE when app starts.
 * It restores auth state if token exists.
 * No UI logic, no redirects here.
 */

const ACCESS_TOKEN_KEY = 'access_token';

export type AuthUser = {
  id: string;
  role: string;
  email?: string;
};

export type AuthBootstrapResult = {
  isAuthenticated: boolean;
  user: AuthUser | null;
};

export const authBootstrap = async (): Promise<AuthBootstrapResult> => {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);

  /**
   * ❌ No token → user is logged out
   */
  if (!token) {
    return {
      isAuthenticated: false,
      user: null,
    };
  }

  try {
    /**
     * Token is auto-attached by axios interceptor
     * GET /api/v1/auth/me
     */
    const response = await apiClient.get('/auth/me');

    const user: AuthUser = response.data?.data;

    if (!user || !user.role) {
      throw new Error('Invalid auth response');
    }

    return {
      isAuthenticated: true,
      user,
    };
  } catch (error) {
    /**
     * ❌ Token invalid / expired
     * Cleanup local state
     */
    localStorage.removeItem(ACCESS_TOKEN_KEY);

    return {
      isAuthenticated: false,
      user: null,
    };
  }
};
