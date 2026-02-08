import { z } from "zod";

/**
 * Generic ID validation
 * - Backend-agnostic (MongoId / UUID / custom)
 * - Non-empty, trimmed
 * - Reusable across entire platform
 */
export const IdSchema = z
  .string()
  .trim()
  .min(1, { message: "ID is required" });

export type Id = z.infer<typeof IdSchema>;
