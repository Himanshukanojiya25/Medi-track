import { z } from "zod";
import { IdSchema } from "../common";

/**
 * Assign / change role inside hospital scope
 */
export const RoleAssignSchema = z.object({
  userId: IdSchema,

  role: z.enum(["DOCTOR", "HOSPITAL_ADMIN"], {
    message: "Invalid role for assignment",
  }),

  isActive: z.boolean().optional(),
});

export type RoleAssignInput = z.infer<typeof RoleAssignSchema>;
