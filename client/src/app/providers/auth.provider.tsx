import React, { createContext, useContext, useState } from "react";
import type { AppRole } from "../constants";

type AuthState = {
  role: AppRole;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthState>({
  role: "public",
  isAuthenticated: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state] = useState<AuthState>({
    role: "public",
    isAuthenticated: false,
  });

  return (
    <AuthContext.Provider value={state}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);
