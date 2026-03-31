import { z } from "zod";

export const searchQuerySchema = z.object({
  q: z.string().min(1, "Search query is required"),
  location: z.string().optional(),
  speciality: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});