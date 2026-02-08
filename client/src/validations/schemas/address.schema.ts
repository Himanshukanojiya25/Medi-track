import { z } from "zod";

/**
 * Address schema
 * - Generic enough for global usage
 * - Strict field validation
 * - Reusable across hospital, patient, billing
 */
export const AddressSchema = z.object({
  line1: z.string().trim().min(3, { message: "Address line1 is required" }),
  line2: z.string().trim().optional(),
  city: z.string().trim().min(2, { message: "City is required" }),
  state: z.string().trim().min(2, { message: "State is required" }),
  country: z.string().trim().min(2, { message: "Country is required" }),
  postalCode: z
    .string()
    .trim()
    .min(3, { message: "Postal code is too short" })
    .max(12, { message: "Postal code is too long" }),
});

export type Address = z.infer<typeof AddressSchema>;
