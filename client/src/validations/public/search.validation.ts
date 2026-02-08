import { z } from "zod";
import { PaginationSchema } from "../common";

/**
 * Public search (hospitals, doctors, services)
 */
export const PublicSearchSchema = PaginationSchema.extend({
  query: z
    .string()
    .trim()
    .min(1, { message: "Search query cannot be empty" })
    .max(100, { message: "Search query is too long" })
    .optional(),

  city: z
    .string()
    .trim()
    .max(50, { message: "City is too long" })
    .optional(),

  specialization: z
    .string()
    .trim()
    .max(50, { message: "Specialization is too long" })
    .optional(),

  sortBy: z
    .enum(["RELEVANCE", "RATING", "DISTANCE"], {
      message: "Invalid sort option",
    })
    .optional(),
});

export type PublicSearchInput = z.infer<
  typeof PublicSearchSchema
>;
