import { Router } from 'express';
import { getAIUsageStats } from '../../controllers/ai/ai-usage.controller';

const router = Router();

router.get('/usage', getAIUsageStats);

export default router;
