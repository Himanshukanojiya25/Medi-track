import { z } from "zod";
import { IdSchema } from "../common";

/**
 * AI chat message input validation
 */
export const AIMessageSchema = z.object({
  sessionId: IdSchema.optional(),

  role: z.enum(["USER", "SYSTEM"], {
    message: "Invalid message role",
  }),

  content: z
    .string()
    .trim()
    .min(1, { message: "Message content cannot be empty" })
    .max(4000, { message: "Message content is too long" }),

  metadata: z
    .record(z.string(), z.unknown())
    .optional(),
});

export type AIMessageInput = z.infer<typeof AIMessageSchema>;
