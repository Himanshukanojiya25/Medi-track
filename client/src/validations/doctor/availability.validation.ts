import { z } from "zod";
import { IdSchema } from "../common";

/**
 * Doctor availability validation
 */
export const DoctorAvailabilitySchema = z
  .object({
    doctorId: IdSchema,

    dayOfWeek: z
      .number()
      .int()
      .min(0, { message: "dayOfWeek must be between 0 and 6" })
      .max(6, { message: "dayOfWeek must be between 0 and 6" }),

    startTime: z
      .string()
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
        message: "startTime must be in HH:mm format",
      }),

    endTime: z
      .string()
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
        message: "endTime must be in HH:mm format",
      }),
  })
  .superRefine((data, ctx) => {
    if (data.startTime >= data.endTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endTime"],
        message: "endTime must be after startTime",
      });
    }
  });

export type DoctorAvailabilityInput = z.infer<
  typeof DoctorAvailabilitySchema
>;
