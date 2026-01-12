// src/types/auth/auth.types.ts

/**
 * -------------------------
 * ROLE TYPE (RBAC BASE)
 * -------------------------
 * ❗ Single source of truth for all roles
 */
export type Role =
  | "SUPER_ADMIN"
  | "HOSPITAL_ADMIN"
  | "DOCTOR"
  | "PATIENT";

/**
 * -------------------------
 * LOGIN INPUT
 * -------------------------
 * Used by controller & validation
 */
export interface LoginInput {
  email: string;
  password: string;
}

/**
 * -------------------------
 * JWT PAYLOAD
 * -------------------------
 * Ye object token ke andar store hota hai
 * Aur decode hoke req.user ban jaata hai
 */
export interface JwtPayload {
  id: string;          // User _id
  role: Role;          // Strict role (RBAC safe)
  hospitalId?: string; // Optional (patient / doctor)
}

/**
 * -------------------------
 * AUTHENTICATED USER
 * -------------------------
 * req.user ka exact shape
 */
export interface AuthUser {
  id: string;
  role: Role;
  hospitalId?: string;
}

/**
 * -------------------------
 * LOGIN RESPONSE
 * -------------------------
 * Controller se client ko milta hai
 */
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}
