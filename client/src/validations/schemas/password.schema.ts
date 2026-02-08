import { z } from "zod";

/**
 * Password security schema
 * - Minimum 8 characters
 * - Uppercase, lowercase, number, special char
 * - No UI assumptions
 */
export const PasswordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .max(128, { message: "Password is too long" })
  .regex(/[a-z]/, { message: "Password must contain a lowercase letter" })
  .regex(/[A-Z]/, { message: "Password must contain an uppercase letter" })
  .regex(/\d/, { message: "Password must contain a number" })
  .regex(/[^A-Za-z0-9]/, {
    message: "Password must contain a special character",
  });

export type Password = z.infer<typeof PasswordSchema>;
