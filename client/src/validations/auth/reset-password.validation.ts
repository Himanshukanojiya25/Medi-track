import { z } from "zod";
import { PasswordSchema } from "../schemas";

/**
 * Reset password validation (forgot password flow)
 */
export const ResetPasswordSchema = z
  .object({
    token: z.string().min(10, {
      message: "Reset token is invalid",
    }),

    newPassword: PasswordSchema,

    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Passwords do not match",
      });
    }
  });

export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;
