import { z } from "zod";

export const PrescriptionCreateSchema = z.object({
  appointmentId: z.string().min(24, "Invalid appointmentId"),

  medicines: z.array(
    z.object({
      name: z.string().min(1),
      dosage: z.string().min(1),
      frequency: z.string().min(1),
      durationDays: z.number().int().min(1),
      instructions: z.string().optional(),
    })
  ).min(1, "At least one medicine is required"),

  notes: z.string().max(2000).optional(),
});
