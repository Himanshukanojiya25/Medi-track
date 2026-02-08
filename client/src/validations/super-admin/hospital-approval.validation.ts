import { z } from "zod";
import { IdSchema } from "../common";

/**
 * Hospital approval / rejection validation
 * Super Admin only
 */
export const HospitalApprovalSchema = z
  .object({
    hospitalId: IdSchema,

    action: z.enum(["APPROVE", "REJECT"], {
      message: "Action must be APPROVE or REJECT",
    }),

    reason: z
      .string()
      .trim()
      .min(5, { message: "Reason must be at least 5 characters" })
      .max(500, { message: "Reason is too long" })
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.action === "REJECT" && !data.reason) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["reason"],
        message: "Reason is required when rejecting a hospital",
      });
    }
  });

export type HospitalApprovalInput = z.infer<typeof HospitalApprovalSchema>;
