import type { Dispatch, SetStateAction } from 'react';
import type { AuthState } from '../../store/auth';

/**
 * Central logout logic
 * - Clears token
 * - Resets auth store
 */
export const logout = (
  setAuthState: Dispatch<SetStateAction<AuthState>>
) => {
  localStorage.removeItem('access_token');

  setAuthState({
    isAuthenticated: false,
    user: null,
    loading: false,
  });
};
