import { z } from "zod";
import { IdSchema } from "../common";

/**
 * Hospital Admin → Update billing settings
 */
export const BillingUpdateSchema = z.object({
  hospitalId: IdSchema,

  consultationFee: z
    .number()
    .int()
    .min(0, { message: "consultationFee must be >= 0" })
    .max(1_000_000, { message: "consultationFee exceeds allowed limit" })
    .optional(),

  currency: z
    .string()
    .trim()
    .length(3, { message: "Currency must be a 3-letter code" })
    .toUpperCase()
    .optional(),

  isBillingEnabled: z.boolean().optional(),
});

export type BillingUpdateInput = z.infer<typeof BillingUpdateSchema>;
