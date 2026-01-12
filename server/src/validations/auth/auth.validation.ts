// src/validations/auth/auth.validation.ts

import { z } from "zod";

/**
 * Login request validation
 */
export const loginSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email("Invalid email format")
      .min(5, "Email is required"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  }),
});
