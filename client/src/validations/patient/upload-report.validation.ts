import { z } from "zod";
import { IdSchema } from "../common";

/**
 * Upload medical report (metadata only)
 */
export const UploadReportSchema = z.object({
  patientId: IdSchema,

  title: z
    .string()
    .trim()
    .min(3, { message: "Title is too short" })
    .max(120, { message: "Title is too long" }),

  description: z
    .string()
    .trim()
    .max(500, { message: "Description is too long" })
    .optional(),

  fileType: z.enum(["PDF", "IMAGE"], {
    message: "fileType must be PDF or IMAGE",
  }),

  fileSizeKb: z
    .number()
    .int()
    .min(1, { message: "fileSizeKb must be >= 1" })
    .max(10240, { message: "File size exceeds 10MB limit" }),
});

export type UploadReportInput = z.infer<
  typeof UploadReportSchema
>;
