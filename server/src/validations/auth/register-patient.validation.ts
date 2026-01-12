// src/validations/auth/register-patient.validation.ts

import { z } from "zod";

/**
 * Patient registration validation
 */
export const registerPatientSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name is too long"),

    email: z
      .string()
      .email("Invalid email format"),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(64, "Password is too long"),

    phone: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .max(15, "Phone number is too long")
      .optional(),
  }),
});
