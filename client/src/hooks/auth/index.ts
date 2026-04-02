// client/src/hooks/auth/index.ts
export { useAuth } from './useAuth';
export { useLogin } from './useLogin';
export { useLogout } from './useLogout';
export { useCurrentUser } from './useCurrentUser';

export type { UseAuthReturn, User, AuthState, LoginCredentials, RegisterCredentials } from './useAuth';
export type { UseLoginOptions, UseLoginReturn } from './useLogin';
export type { UseLogoutOptions, UseLogoutReturn } from './useLogout';
export type { UseCurrentUserOptions, UseCurrentUserReturn, CurrentUser } from './useCurrentUser';