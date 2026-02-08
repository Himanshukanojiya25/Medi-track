import { z } from "zod";
import { PaginationSchema } from "../common";

/**
 * Invoice listing / filtering validation
 */
export const InvoiceFilterSchema = PaginationSchema.extend({
  hospitalId: z.string().optional(),
  patientId: z.string().optional(),

  status: z
    .enum(["PAID", "UNPAID", "CANCELLED"], {
      message: "Invalid invoice status",
    })
    .optional(),

  fromDate: z
    .string()
    .datetime({ message: "fromDate must be a valid ISO datetime" })
    .optional(),

  toDate: z
    .string()
    .datetime({ message: "toDate must be a valid ISO datetime" })
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

export type InvoiceFilterInput = z.infer<
  typeof InvoiceFilterSchema
>;
