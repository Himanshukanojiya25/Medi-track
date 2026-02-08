import { z } from "zod";
import { EmailSchema, PhoneSchema, AddressSchema } from "../schemas";

/**
 * Hospital onboarding validation
 * - Strict but extensible
 * - No business logic
 * - Safe for long-term evolution
 */
export const HospitalOnboardingSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { message: "Hospital name is too short" })
    .max(120, { message: "Hospital name is too long" }),

  email: EmailSchema,

  phone: PhoneSchema,

  address: AddressSchema,

  registrationNumber: z
    .string()
    .trim()
    .min(5, { message: "Registration number is required" })
    .max(50, { message: "Registration number is too long" }),

  metadata: z
    .record(z.string(), z.unknown())
    .optional(), // future-proofing
});

export type HospitalOnboardingInput = z.infer<
  typeof HospitalOnboardingSchema
>;
