import { z } from "zod";
import { IdSchema } from "../common";

/**
 * Patient appointment booking
 */
export const AppointmentBookSchema = z
  .object({
    patientId: IdSchema,
    doctorId: IdSchema,

    date: z
      .string()
      .datetime({ message: "date must be a valid ISO datetime" }),

    slotStart: z
      .string()
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
        message: "slotStart must be in HH:mm format",
      }),

    slotEnd: z
      .string()
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
        message: "slotEnd must be in HH:mm format",
      }),

    notes: z
      .string()
      .trim()
      .max(500, { message: "Notes is too long" })
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.slotStart >= data.slotEnd) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["slotEnd"],
        message: "slotEnd must be after slotStart",
      });
    }
  });

export type AppointmentBookInput = z.infer<
  typeof AppointmentBookSchema
>;
