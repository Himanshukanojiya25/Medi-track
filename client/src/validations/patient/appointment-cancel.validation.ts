import { z } from "zod";
import { IdSchema } from "../common";

/**
 * Patient appointment cancellation
 */
export const AppointmentCancelSchema = z.object({
  appointmentId: IdSchema,

  reason: z
    .string()
    .trim()
    .min(3, { message: "Reason must be at least 3 characters" })
    .max(300, { message: "Reason is too long" })
    .optional(),
});

export type AppointmentCancelInput = z.infer<
  typeof AppointmentCancelSchema
>;
