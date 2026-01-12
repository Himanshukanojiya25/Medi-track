import { z } from 'zod';

export const aiUsageQuerySchema = z.object({
  hospitalId: z.string(),
});
