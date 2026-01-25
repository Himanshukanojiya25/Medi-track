import { z } from "zod";

/**
 * Patient registration validation
 * --------------------------------
 * Must stay in sync with:
 * - Patient schema
 * - registerPatientController
 * - registerPatientService
 */
export const registerPatientSchema = z.object({
  body: z.object({
    firstName: z
      .string()
      .min(2, "First name must be at least 2 characters")
      .max(50, "First name is too long"),

    lastName: z
      .string()
      .min(2, "Last name must be at least 2 characters")
      .max(50, "Last name is too long")
      .optional(),

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
