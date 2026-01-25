import { createContext } from 'react';
import type { AuthState } from './auth.types';
import type { Dispatch, SetStateAction } from 'react';

export type AuthContextValue = AuthState & {
  setAuthState: Dispatch<SetStateAction<AuthState>>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);
