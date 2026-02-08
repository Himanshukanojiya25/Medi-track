import { z } from "zod";
import { IdSchema } from "../common";

/**
 * AI response feedback validation
 */
export const AIFeedbackSchema = z.object({
  messageId: IdSchema,

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

export type AIFeedbackInput = z.infer<typeof AIFeedbackSchema>;
