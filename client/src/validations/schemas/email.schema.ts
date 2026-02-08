import { z } from "zod";

/**
 * Enterprise-grade email schema
 * - RFC compliant (practical)
 * - Lowercased + trimmed
 * - Predictable error message
 */
export const EmailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(5, { message: "Email is too short" })
  .max(254, { message: "Email is too long" })
  .email({ message: "Invalid email format" });

export type Email = z.infer<typeof EmailSchema>;
