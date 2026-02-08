import { z } from "zod";

/**
 * Pagination validation
 * - Safe defaults
 * - Hard upper bounds to prevent abuse
 * - Works for 100 users or 10M users
 */
export const PaginationSchema = z.object({
  page: z
    .number()
    .int()
    .min(1, { message: "Page must be >= 1" })
    .default(1),

  limit: z
    .number()
    .int()
    .min(1, { message: "Limit must be >= 1" })
    .max(100, { message: "Limit cannot exceed 100" })
    .default(20),
});

export type PaginationInput = z.infer<typeof PaginationSchema>;
