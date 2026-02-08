import { z } from "zod";
import { IdSchema } from "../common";

/**
 * Payment initiation / confirmation validation
 */
export const PaymentSchema = z
  .object({
    invoiceId: IdSchema,

    amount: z
      .number()
      .positive({ message: "Amount must be greater than 0" })
      .max(1_000_000, { message: "Amount exceeds allowed limit" }),

    currency: z
      .string()
      .trim()
      .length(3, { message: "Currency must be a 3-letter code" })
      .toUpperCase(),

    method: z.enum(
      ["CARD", "UPI", "NET_BANKING", "WALLET", "CASH"],
      { message: "Invalid payment method" }
    ),

    referenceId: z
      .string()
      .trim()
      .min(5, { message: "referenceId is too short" })
      .max(100, { message: "referenceId is too long" })
      .optional(),

    notes: z
      .string()
      .trim()
      .max(500, { message: "Notes is too long" })
      .optional(),
  })
  .superRefine((data, ctx) => {
    // Reference ID is required for non-cash payments
    if (data.method !== "CASH" && !data.referenceId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["referenceId"],
        message: "referenceId is required for non-cash payments",
      });
    }
  });

export type PaymentInput = z.infer<typeof PaymentSchema>;
