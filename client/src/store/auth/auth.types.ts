export type AuthUser = {
  id: string;
  role: string;
  email?: string;
};

export type AuthState = {
  isAuthenticated: boolean;
  user: AuthUser | null;
  loading: boolean;
};
