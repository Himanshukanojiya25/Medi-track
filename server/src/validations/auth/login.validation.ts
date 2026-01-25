import { z } from "zod";

/**
 * ============================
 * 🔐 LOGIN VALIDATION
 * ============================
 * Supports:
 * - email + password
 * - role-aware login
 */
export const loginSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email("Invalid email address"),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  }),
});
