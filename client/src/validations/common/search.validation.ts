import { z } from "zod";

/**
 * Generic search validation
 * - Used for listing, discovery, admin panels
 * - Bounded length to avoid heavy queries
 */
export const SearchSchema = z.object({
  query: z
    .string()
    .trim()
    .min(1, { message: "Search query cannot be empty" })
    .max(100, { message: "Search query is too long" })
    .optional(),
});

export type SearchInput = z.infer<typeof SearchSchema>;
