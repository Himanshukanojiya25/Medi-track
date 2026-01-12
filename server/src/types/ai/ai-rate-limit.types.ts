import { AIRateLimitWindow } from '../../constants/ai/ai-rate-limit.constants';

export interface AIRateLimitCheckInput {
  userId: string;
  role: string;
  hospitalId: string;
  window: AIRateLimitWindow;
}

export interface AIRateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  resetAt: Date;
}
