import { z } from "zod";
import { EmailSchema, PasswordSchema } from "../schemas";

/**
 * Login validation
 */
export const LoginSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
});

export type LoginInput = z.infer<typeof LoginSchema>;
