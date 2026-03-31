import { z } from "zod";

export const aiSymptomBodySchema = z.object({
  symptoms: z.string().min(1, "Symptoms are required"),
  age: z.coerce.number().int().min(0).max(120).optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
});