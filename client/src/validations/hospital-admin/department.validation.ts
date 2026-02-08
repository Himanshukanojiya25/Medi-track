import { z } from "zod";

/**
 * Create / update hospital department
 */
export const DepartmentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Department name is too short" })
    .max(100, { message: "Department name is too long" }),

  description: z
    .string()
    .trim()
    .max(500, { message: "Description is too long" })
    .optional(),

  isActive: z.boolean().optional(),
});

export type DepartmentInput = z.infer<typeof DepartmentSchema>;
