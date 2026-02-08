import { z } from "zod";
import { EmailSchema, PhoneSchema, PasswordSchema } from "../schemas";

/**
 * Signup validation
 */
export const SignupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Name is too short" })
    .max(100, { message: "Name is too long" }),

  email: EmailSchema,

  phone: PhoneSchema.optional(),

  password: PasswordSchema,

  confirmPassword: z.string(),
}).superRefine((data, ctx) => {
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["confirmPassword"],
      message: "Passwords do not match",
    });
  }
});

export type SignupInput = z.infer<typeof SignupSchema>;
