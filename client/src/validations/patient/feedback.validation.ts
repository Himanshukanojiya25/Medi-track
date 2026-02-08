import { z } from "zod";
import { IdSchema } from "../common";

/**
 * Patient feedback / rating
 */
export const PatientFeedbackSchema = z.object({
  appointmentId: IdSchema,

  rating: z
    .number()
    .int()
    .min(1, { message: "Rating must be at least 1" })
    .max(5, { message: "Rating cannot exceed 5" }),

  comment: z
    .string()
    .trim()
    .max(500, { message: "Comment is too long" })
    .optional(),
});

export type PatientFeedbackInput = z.infer<
  typeof PatientFeedbackSchema
>;
