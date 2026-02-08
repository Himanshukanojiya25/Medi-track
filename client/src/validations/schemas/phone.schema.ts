import { z } from "zod";

/**
 * Phone number schema (E.164 inspired)
 * - Supports country codes
 * - Digits only, optional +
 * - Length safe for global usage
 */
export const PhoneSchema = z
  .string()
  .trim()
  .regex(/^\+?[1-9]\d{7,14}$/, {
    message: "Invalid phone number format",
  });

export type PhoneNumber = z.infer<typeof PhoneSchema>;
