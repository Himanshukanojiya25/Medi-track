import { z } from "zod";
import { PaginationSchema } from "../common";

/**
 * AI usage analytics filter validation
 */
export const AIUsageFilterSchema = PaginationSchema.extend({
  fromDate: z
    .string()
    .datetime({ message: "fromDate must be a valid ISO datetime" })
    .optional(),

  toDate: z
    .string()
    .datetime({ message: "toDate must be a valid ISO datetime" })
    .optional(),

  role: z
    .enum(["PATIENT", "DOCTOR", "HOSPITAL_ADMIN", "SUPER_ADMIN"], {
      message: "Invalid role filter",
    })
    .optional(),
}).superRefine((data, ctx) => {
  if (data.fromDate && data.toDate && data.fromDate > data.toDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["toDate"],
      message: "toDate must be after fromDate",
    });
  }
});

export type AIUsageFilterInput = z.infer<
  typeof AIUsageFilterSchema
>;
