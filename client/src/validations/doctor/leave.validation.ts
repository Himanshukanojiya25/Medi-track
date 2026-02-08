import { z } from "zod";
import { IdSchema } from "../common";

/**
 * Doctor leave validation
 */
export const DoctorLeaveSchema = z
  .object({
    doctorId: IdSchema,

    fromDate: z
      .string()
      .datetime({ message: "fromDate must be a valid ISO datetime" }),

    toDate: z
      .string()
      .datetime({ message: "toDate must be a valid ISO datetime" }),

    reason: z
      .string()
      .trim()
      .min(5, { message: "Reason must be at least 5 characters" })
      .max(300, { message: "Reason is too long" }),
  })
  .superRefine((data, ctx) => {
    if (data.fromDate >= data.toDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["toDate"],
        message: "toDate must be after fromDate",
      });
    }
  });

export type DoctorLeaveInput = z.infer<typeof DoctorLeaveSchema>;
