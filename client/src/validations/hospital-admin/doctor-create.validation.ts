import { z } from "zod";
import { EmailSchema, PhoneSchema, PasswordSchema } from "../schemas";
import { IdSchema } from "../common";

/**
 * Hospital Admin → Create Doctor
 */
export const DoctorCreateSchema = z
  .object({
    hospitalId: IdSchema,
    departmentId: IdSchema,

    name: z
      .string()
      .trim()
      .min(2, { message: "Name is too short" })
      .max(100, { message: "Name is too long" }),

    email: EmailSchema,
    phone: PhoneSchema.optional(),
    password: PasswordSchema,

    specialization: z
      .string()
      .trim()
      .min(2, { message: "Specialization is too short" })
      .max(100, { message: "Specialization is too long" }),

    experienceYears: z
      .number()
      .int()
      .min(0, { message: "experienceYears must be >= 0" })
      .max(60, { message: "experienceYears is too large" })
      .optional(),

    isActive: z.boolean().optional(),
  });

export type DoctorCreateInput = z.infer<typeof DoctorCreateSchema>;
