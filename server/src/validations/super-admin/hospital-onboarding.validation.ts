import { z } from 'zod';

export const hospitalIdParamSchema = z.object({
  hospitalId: z.string().min(24),
});

export const rejectHospitalSchema = z.object({
  reason: z.string().min(5),
});
