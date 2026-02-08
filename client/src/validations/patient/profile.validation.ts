import { z } from "zod";
import { EmailSchema, PhoneSchema, AddressSchema } from "../schemas";

/**
 * Patient profile update
 */
export const PatientProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Name is too short" })
    .max(100, { message: "Name is too long" }),

  email: EmailSchema.optional(),

  phone: PhoneSchema.optional(),

  address: AddressSchema.optional(),

  dateOfBirth: z
    .string()
    .datetime({ message: "dateOfBirth must be a valid ISO datetime" })
    .optional(),

  gender: z.enum(["MALE", "FEMALE", "OTHER"], {
    message: "Invalid gender value",
  }).optional(),
});

export type PatientProfileInput = z.infer<
  typeof PatientProfileSchema
>;
