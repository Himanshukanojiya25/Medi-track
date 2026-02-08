import { z } from "zod";
import { PasswordSchema } from "../schemas";

/**
 * Change password validation (logged-in user)
 */
export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, {
      message: "Current password is required",
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

    if (data.currentPassword === data.newPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["newPassword"],
        message: "New password must be different from current password",
      });
    }
  });

export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;
