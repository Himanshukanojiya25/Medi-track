import { z } from "zod";
import { IdSchema } from "../common";

/**
 * Suspension / Unsuspension validation
 * Works for hospital & user
 */
export const SuspensionSchema = z
  .object({
    targetId: IdSchema,

    targetType: z.enum(["HOSPITAL", "USER"], {
      message: "Target type must be HOSPITAL or USER",
    }),

    action: z.enum(["SUSPEND", "UNSUSPEND"], {
      message: "Action must be SUSPEND or UNSUSPEND",
    }),

    reason: z
      .string()
      .trim()
      .min(5, { message: "Reason must be at least 5 characters" })
      .max(500, { message: "Reason is too long" })
      .optional(),

    until: z.string().datetime().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.action === "SUSPEND" && !data.reason) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["reason"],
        message: "Reason is required when suspending",
      });
    }
  });

export type SuspensionInput = z.infer<typeof SuspensionSchema>;
