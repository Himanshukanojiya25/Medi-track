import { z } from "zod";
import { EmailSchema, PhoneSchema } from "../schemas";

/**
 * Public contact / support form
 */
export const ContactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Name is too short" })
    .max(100, { message: "Name is too long" }),

  email: EmailSchema,

  phone: PhoneSchema.optional(),

  subject: z
    .string()
    .trim()
    .min(3, { message: "Subject is too short" })
    .max(120, { message: "Subject is too long" }),

  message: z
    .string()
    .trim()
    .min(10, { message: "Message is too short" })
    .max(2000, { message: "Message is too long" }),
});

export type ContactFormInput = z.infer<
  typeof ContactFormSchema
>;
