import { z } from "zod";

/**
 * Public AI symptom checker input
 * (no medical diagnosis claims)
 */
export const AISymptomSchema = z.object({
  symptoms: z
    .array(
      z
        .string()
        .trim()
        .min(2, { message: "Symptom is too short" })
        .max(50, { message: "Symptom is too long" })
    )
    .min(1, { message: "At least one symptom is required" })
    .max(10, { message: "Too many symptoms provided" }),

  age: z
    .number()
    .int()
    .min(0, { message: "Age must be >= 0" })
    .max(120, { message: "Age is not valid" })
    .optional(),

  gender: z
    .enum(["MALE", "FEMALE", "OTHER"], {
      message: "Invalid gender value",
    })
    .optional(),

  durationDays: z
    .number()
    .int()
    .min(0, { message: "durationDays must be >= 0" })
    .max(365, { message: "durationDays is too large" })
    .optional(),
});

export type AISymptomInput = z.infer<
  typeof AISymptomSchema
>;
