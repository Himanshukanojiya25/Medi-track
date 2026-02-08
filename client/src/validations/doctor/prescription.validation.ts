import { z } from "zod";
import { IdSchema } from "../common";

/**
 * Prescription validation
 * Doctor → Patient
 */
export const PrescriptionSchema = z.object({
  doctorId: IdSchema,
  patientId: IdSchema,
  appointmentId: IdSchema.optional(),

  diagnosis: z
    .string()
    .trim()
    .min(3, { message: "Diagnosis is too short" })
    .max(500, { message: "Diagnosis is too long" }),

  medicines: z
    .array(
      z.object({
        name: z
          .string()
          .trim()
          .min(1, { message: "Medicine name is required" }),

        dosage: z
          .string()
          .trim()
          .min(1, { message: "Dosage is required" }),

        frequency: z
          .string()
          .trim()
          .min(1, { message: "Frequency is required" }),

        durationDays: z
          .number()
          .int()
          .min(1, { message: "durationDays must be >= 1" })
          .max(365, { message: "durationDays is too large" }),
      })
    )
    .min(1, { message: "At least one medicine is required" }),

  notes: z
    .string()
    .trim()
    .max(1000, { message: "Notes is too long" })
    .optional(),
});

export type PrescriptionInput = z.infer<typeof PrescriptionSchema>;
