import { useState } from 'react';
import type { ReactNode } from 'react';

import { AuthContext } from './auth.context';
import type { AuthState } from './auth.types';

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: true,
};

type Props = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: Props) => {
  const [authState, setAuthState] = useState<AuthState>(initialState);

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        setAuthState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
