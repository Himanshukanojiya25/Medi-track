import { Request, Response } from 'express';
import { AIUsageAggregationService } from '../../services/ai/ai-usage-aggregation.service';

export const getAIUsageStats = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { hospitalId } = req.query as { hospitalId: string };

  const data = await AIUsageAggregationService.getHospitalUsage(hospitalId);

  res.json({ success: true, data });
};
