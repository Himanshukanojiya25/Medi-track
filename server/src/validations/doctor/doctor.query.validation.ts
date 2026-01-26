import { z } from "zod";

export const doctorListQuerySchema = z.object({
  departmentId: z.string().optional(),
  hospitalId: z.string().optional(),
});
